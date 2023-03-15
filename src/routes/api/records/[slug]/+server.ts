import type { RequestHandler } from '@sveltejs/kit'
import type { Record } from '@prisma/client'
import { prisma } from '@/utils/db'
import response from '@/utils/response'
import RecordsDao from '@/dao/records'

// [DELETE]: api/records/:recordId
// Deletes a record for a given user
// Endpoint checks if the specified record belongs to the user before deleting the record
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const user = locals.user
	const { slug: recordId } = params

	if (!user) {
		return response.unauthorized('user not found')
	}

	if (!recordId) {
		return response.badRequest('no record id specified')
	}

	const recordIdInt = parseInt(recordId)

	let record: Record

	try {
		const existingRecord = await RecordsDao.findById(prisma, recordIdInt)
		if (!existingRecord) throw new Error('record not found')
		record = existingRecord
	} catch {
		return response.internalServerError('record not found')
	}

	if (record.userId !== user.id) {
		return response.unauthorized('unable to delete a counter that is not yours')
	}

	try {
		record = await RecordsDao.deleteRecord(prisma, recordIdInt)
	} catch {
		return response.internalServerError('unable to delete counter')
	}

	return response.ok(record.id)
}
