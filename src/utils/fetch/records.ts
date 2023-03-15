import type { Record } from '@prisma/client'
import type { NewRecordRequest } from '@/@types/client/records'
import type { GetRecordHistoryRequest, GetRecordHistoryResponse } from '@/@types/api/records'
import { objectToURLSearchParams } from '@/utils/fetch/utils'

const ROUTE = '/api/records'

export const callCreateRecord = async (body: NewRecordRequest) => {
	const response = await fetch(ROUTE, {
		method: 'POST',
		body: JSON.stringify(body),
	})
	const data = (await response.json()) as Record
	return data
}

export const callGetRecordHistory = async (request: GetRecordHistoryRequest) => {
	const params = objectToURLSearchParams(request)
	const response = await fetch(`${ROUTE}?${params.toString()}`)
	const data = (await response.json()) as GetRecordHistoryResponse
	return data
}

export const callDeleteRecord = async (recordId: number) => {
	const response = await fetch(`${ROUTE}/${recordId}`, {
		method: 'DELETE',
	})
	const data = (await response.json()) as number
	return data
}
