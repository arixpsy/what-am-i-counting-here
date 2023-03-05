import type { RequestHandler } from "@sveltejs/kit"
import type { Label } from "@prisma/client"
import response from "@/utils/response"
import LabelsDao from "@/dao/labels"
import type { GetLabelsRequest } from "@/@types/client/labels"

// [GET]: api/labels
// Returns a list of 5 labels previously used for a given user sorted by latest used
export const GET: RequestHandler = async ({ locals, request }) => {
	const user = locals.user

	if (!user) {
		return response.unauthorized('user not found')
	}

  let getLabelsRequest: GetLabelsRequest = {
		searchPhrase: ''
	}
	try {
		getLabelsRequest = (await request.json()) as GetLabelsRequest
	} catch {
		console.debug('unable to parse body')
	}

	let labels: Array<Label> = []

	try {
		labels = await LabelsDao.findAllByUserId(user.id, getLabelsRequest.searchPhrase)
	} catch {
		return response.internalServerError('unable to find labels')
	}

	return response.ok(labels)
}