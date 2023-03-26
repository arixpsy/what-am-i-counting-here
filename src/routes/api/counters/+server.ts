import type { Counter } from '@prisma/client'
import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '@/utils/db'
import response from '@/utils/response'
import type { GetCounterResponse } from '@/@types/api/counters'
import type { NewCounterRequest } from '@/@types/client/counters'
import CountersDao from '@/dao/counters'
import RecordsDao from '@/dao/records'
import { accumulateRecordIncrements, getDefaultRecordFilterRange } from '@/utils/counters'

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
		counters = await CountersDao.findAllByUserId(prisma, user.id)
	} catch {
		return response.internalServerError('unable to find counters')
	}

	for (const counter of counters) {
		const [startRange, endRange] = getDefaultRecordFilterRange(counter, user)

		const records = await RecordsDao.findAllByCounterId(prisma, counter.id, startRange, endRange)

		responseBody.push({
			...counter,
			currentCount: accumulateRecordIncrements(records),
		})
	}
	return response.ok(responseBody)
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
		counter = await CountersDao.createCounter(prisma, { userId: user.id, ...newCounterRequest })
	} catch {
		return response.internalServerError('unable to create new counter')
	}

	return response.ok(counter)
}
