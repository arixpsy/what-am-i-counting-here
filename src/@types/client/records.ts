import { z } from 'zod'
import type { Record } from '@prisma/client'
import type { NewRecord } from '@/@types/api/records'

const RecordIncrementValue = z
	.number({
		required_error: 'Cannot be empty',
		invalid_type_error: 'Cannot be empty',
	})
	.min(1, 'Invalid increment')

export const RecordFormSchema = z.object({
	increment: RecordIncrementValue,
	labels: z.array(z.string()),
	description: z.string(),
})

export type NewRecordRequest = Omit<NewRecord, 'userId'> & {
	labels: Array<string>
}

export type RecordsInChartFormat = Array<{
	index: number
	start: number
	end: number
	data: Array<Record>
}>