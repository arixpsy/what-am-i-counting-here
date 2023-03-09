import type { Record, Counter, Label } from '@prisma/client'

export type NewRecord = Pick<Record, 'counterId' | 'description' | 'increment' | 'userId'>

export type RecordWithCounterAndLabel = Record & {
	counter: Counter
	labels: Array<Label>
}

export type GetRecordHistoryRequest = {
	counterId?: number
	size?: number
	cursor?: number
}

export type GetRecordHistoryResponse = {
	cursorNext?: number
	data: Array<{
		date: Date
		records: Array<RecordWithCounterAndLabel>
	}>
}
