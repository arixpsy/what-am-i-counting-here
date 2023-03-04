import type { Record } from '@prisma/client'
import type { NewRecordRequest } from '@/@types/client/records'

const ROUTE = '/api/records'

export const callCreateRecord = async (body: NewRecordRequest) => {
	const response = await fetch(ROUTE, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	const data = (await response.json()) as Record
	return data
}
