import type { RequestHandler } from '@sveltejs/kit'
import type { Record } from '@prisma/client'
import type { NewRecordRequest } from '@/@types/client/records'
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
