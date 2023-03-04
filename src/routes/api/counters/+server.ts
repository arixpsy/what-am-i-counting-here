import type { RequestHandler } from '@sveltejs/kit'
import { DateTime, type DateTimeUnit } from 'luxon'
import response from '@/utils/response'
import CountersDao from '@/dao/counters'
import type { GetCounterResponse } from '@/@types/api/counters'
import type { NewCounterRequest } from '@/@types/client/counters'
import { ResetType, type Counter, type User, type Record } from '@prisma/client'
import RecordsDao from '@/dao/records'

// [GET]: api/counters
// Returns a list of counters for a given user
// This endpoint also calculates the current value of the counter based on it's reset type
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user
	const responseBody: Array<GetCounterResponse> = []

	if (!user) {
		return response.unauthorized('user not found')
	}

	let counters: Array<Counter> = []

	try {
		counters = await CountersDao.findAllByUserId(user.id)
	} catch {
		return response.internalServerError('unable to find counters')
	}

	for (const counter of counters) {
		const [startRange, endRange] = getRecordFilterRange(counter, user)

		const records = await RecordsDao.findAllByCounterId(counter.id, startRange, endRange)

		responseBody.push({
			...counter,
			currentCount: accumulateRecordIncrements(records),
		})
	}
	return response.ok(JSON.stringify(responseBody))
}

// [POST]: api/counters
// Creates a new counter for a given user from the details obtained from the request body
// Returns the created counter as response payload
export const POST: RequestHandler = async ({ request, locals }) => {
	const user = locals.user

	if (!user) {
		return response.unauthorized('user not found')
	}

	let newCounterRequest: NewCounterRequest
	try {
		newCounterRequest = (await request.json()) as NewCounterRequest
	} catch {
		return response.badRequest('unable to parse body')
	}

	let counter: Counter

	try {
		counter = await CountersDao.createCounter({ userId: user.id, ...newCounterRequest })
	} catch {
		return response.internalServerError('unable to create new counter')
	}

	return response.ok(JSON.stringify(counter))
}

function getRecordFilterRange(counter: Counter, user: User) {
	let startRange = new Date()
	let endRange = new Date()
	const { timezone, createdAt: userCreatedAt } = user
	const { resetType } = counter

	if (resetType === ResetType.Never) {
		startRange = new Date(userCreatedAt)
	} else {
		startRange = DateTime.now()
			.startOf(resetType.toLowerCase() as DateTimeUnit)
			.toJSDate()
	}

	endRange = DateTime.now()
		.setZone(timezone)
		.set({ millisecond: -1, second: 0, minute: 0, hour: 0 })
		.plus({ days: 1 })
		.toJSDate()

	return [startRange, endRange]
}

function accumulateRecordIncrements(records: Array<Record>) {
	return records.reduce((total, r) => total + r.increment, 0)
}
