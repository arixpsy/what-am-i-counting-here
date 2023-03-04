import type { RequestHandler } from '@sveltejs/kit'
import type { Record } from '@prisma/client'
import response from '@/utils/response'
import type { NewRecordRequest } from '@/@types/client/records'
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

  let record: Record;
  try {
    // TODO: use transaction and add labels
    record = await RecordsDao.createRecord({
      userId: user.id,
      counterId: newRecordRequest.counterId,
      increment: newRecordRequest.increment,
      description: newRecordRequest.description,
    })
  } catch {
    return response.internalServerError('unable to create new record')
  }

	return response.ok(record)
}
