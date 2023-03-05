import type { GetLabelsRequest } from "@/@types/client/labels"
import type { Label } from "@prisma/client"

const ROUTE = '/api/labels'

export const callGetLabels = async () => {
	const response = await fetch(ROUTE)
	const data = (await response.json()) as Array<Label>
	return data
}

export const callSearchLabels = async (request: GetLabelsRequest) => {
	const params = new URLSearchParams(request)
	const response = await fetch(`${ROUTE}/search?${params.toString()}`)
	const data = (await response.json()) as Array<Label>
	return data
}