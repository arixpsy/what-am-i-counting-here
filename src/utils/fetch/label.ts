import type { GetLabelsRequest } from "@/@types/client/labels"
import type { Label } from "@prisma/client"

const ROUTE = '/api/labels'

export const callGetLabels = async (request?: GetLabelsRequest) => {
	const response = await fetch(ROUTE, {
    body: JSON.stringify(request)
  })
	const data = (await response.json()) as Array<Label>
	return data
}