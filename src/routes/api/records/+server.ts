import type { RequestHandler } from '@sveltejs/kit'
import type { Counter, Label, Record } from '@prisma/client'
import type { NewRecordRequest } from '@/@types/client/records'
import type { GetRecordHistoryResponse } from '@/@types/api/records'
import { prisma } from '@/utils/db'
import response from '@/utils/response'
import RecordsDao from '@/dao/records'

// [POST]: api/records
// Creates a increment record for a given counter.
// Loops through the RecordRequest labels and adds new
// Returns the create record
export const POST: RequestHandler = async ({ locals, request }) => {
	const user = locals.user

	if (!user) {
		return response.unauthorized('user not found')
	}

	let newRecordRequest: NewRecordRequest
	try {
		newRecordRequest = (await request.json()) as NewRecordRequest
	} catch {
		return response.badRequest('unable to parse body')
	}

	let record: Record
	try {
		record = await RecordsDao.createRecordAndLabels(prisma, user.id, newRecordRequest)
	} catch {
		return response.internalServerError('unable to create new record')
	}

	return response.ok(record)
}

// [GET]: api/records
// Returns a cursor paginate response of a list of days(desc) and the records that were created that day.
// Loops through the records from latests to oldest and generates the response using the user's timezone
export const GET: RequestHandler = async ({ locals, url }) => {
	const user = locals.user
	const sizeString = url.searchParams.get('size')
	const cursorString = url.searchParams.get('cursor')
	const counterIdString = url.searchParams.get('counterId')
	let size: number
	let cursor: number | undefined
	let counterId: number | undefined

	size = parseInt(sizeString || '')
	if (isNaN(size)) {
		size = 10
	}

	cursor = parseInt(cursorString || '')
	if (isNaN(cursor)) {
		cursor = undefined
	}

	counterId = parseInt(counterIdString || '')
	if (isNaN(counterId)) {
		counterId = undefined
	}

	if (!user) {
		return response.unauthorized('user not found')
	}

	let records: Array<
		Record & {
			counter: Counter
			labels: Array<Label>
		}
	>

	try {
		records = await RecordsDao.findAllByUserId(prisma, size, user.id, counterId, cursor)
	} catch {
		return response.internalServerError('unable to find records')
	}

	const cursorNext = records.length ? records[records.length - 1].id : undefined

	const responseBody: GetRecordHistoryResponse = {
		cursorNext,
		data: records,
	}

	return response.ok(responseBody)
}
