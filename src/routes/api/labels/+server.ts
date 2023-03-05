import type { RequestHandler } from '@sveltejs/kit'
import type { Label } from '@prisma/client'
import response from '@/utils/response'
import LabelsDao from '@/dao/labels'

// [GET]: api/labels
// Returns a list of 5 labels previously used for a given user sorted by latest used
export const GET: RequestHandler = async ({ locals }) => {
	const user = locals.user

	if (!user) {
		return response.unauthorized('user not found')
	}

	let labels: Array<Label> = []

	try {
		labels = await LabelsDao.findAllByUserId(user.id, '')
	} catch {
		return response.internalServerError('unable to find labels')
	}

	return response.ok(labels)
}
