import type { PrismaClient } from '@prisma/client'
import type { PrismaClientOrTransaction } from '@/@types/commons/prisma'
import type { NewRecordRequest } from '@/@types/client/records'
import type { NewRecord } from '@/@types/api/records'
import LabelsDao from '@/dao/labels'

const createRecord = (
	db: PrismaClientOrTransaction,
	{ userId, counterId, increment, description }: NewRecord,
	labelIds: Array<{ id: number }>
) =>
	db.record.create({
		data: {
			userId,
			counterId,
			increment,
			description,
			labels: {
				connect: labelIds,
			},
		},
	})

const createRecordAndLabels = (db: PrismaClient, userId: number, data: NewRecordRequest) =>
	db.$transaction(async (tx) => {
		const labelIds: Array<{ id: number }> = []
		const { increment, counterId, description } = data

		for (const value of data.labels) {
			const existingLabel = await LabelsDao.findByUserIdAndLabel(tx, userId, value)

			if (!existingLabel) {
				const newLabel = await LabelsDao.createLabel(tx, userId, value)
				labelIds.push({ id: newLabel.id })
			} else {
				await LabelsDao.updateLabel(tx, existingLabel.id, {
					lastUsed: new Date(),
				})
				labelIds.push({ id: existingLabel.id })
			}
		}

		const record = await createRecord(
			tx,
			{
				userId,
				counterId,
				increment,
				description,
			},
			labelIds
		)

		return record
	})

const findAllByCounterId = (
	db: PrismaClientOrTransaction,
	counterId: number,
	startRange: Date,
	endRange: Date
) =>
	db.record.findMany({
		where: {
			counterId,
			createdAt: {
				gte: startRange,
				lte: endRange,
			},
		},
		orderBy: [
			{
				createdAt: 'desc',
			},
		],
	})

const RecordsDao = {
	createRecord,
	createRecordAndLabels,
	findAllByCounterId,
}

export default RecordsDao
