import type { GetCounterResponse } from '@/@types/api/counters'
import type { NewCounterRequest } from '@/@types/client/counters'
import type { Counter } from '@prisma/client'

const ROUTE = '/api/counters'

export const callGetCounters = async () => {
	const response = await fetch(ROUTE)
	const data = (await response.json()) as Array<GetCounterResponse>
	return data
}

export const callCreateCounter = async (body: NewCounterRequest) => {
	const response = await fetch(ROUTE, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	const data = (await response.json()) as Counter
	return data
}

export const callDeleteCounter = async (counterId: number) => {
	const response = await fetch(`${ROUTE}/${counterId}`, {
		method: 'DELETE',
	})
	const data = (await response.json()) as number
	return data
}
