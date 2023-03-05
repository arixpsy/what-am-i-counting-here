import type { RequestHandler } from "@sveltejs/kit"
import type { Label } from "@prisma/client"
import response from "@/utils/response"
import LabelsDao from "@/dao/labels"

// [GET]: api/labels/search
// Returns a list of 5 labels for a given user sorted by latest used filter by a search phrase
export const GET: RequestHandler = async ({ locals, url }) => {
	const user = locals.user
  const searchPhrase = url.searchParams.get('searchPhrase') || ''

	if (!user) {
		return response.unauthorized('user not found')
	}

	let labels: Array<Label> = []

	try {
		labels = await LabelsDao.findAllByUserId(user.id, searchPhrase)
	} catch {
		return response.internalServerError('unable to find labels')
	}

	return response.ok(labels)
}