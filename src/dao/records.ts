import { Prisma, type PrismaClient } from '@prisma/client'
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

const deleteRecord = (db: PrismaClient, id: number) =>
	db.record.delete({
		where: {
			id,
		},
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
		include: RecordsIncludeCountersLabels,
	})

const RecordsIncludeCountersLabels = Prisma.validator<Prisma.RecordInclude>()({
	counter: true,
	labels: true,
})

const findAllByUserId = (
	db: PrismaClientOrTransaction,
	size: number,
	userId: number,
	counterId?: number,
	cursor?: number
) =>
	db.record.findMany({
		take: size,
		skip: cursor ? 1 : 0,
		cursor: cursor
			? {
					id: cursor,
			  }
			: undefined,
		where: {
			userId,
			counterId,
		},
		orderBy: {
			id: 'desc',
		},
		include: RecordsIncludeCountersLabels,
	})

const findById = (db: PrismaClient, id: number) => db.record.findFirst({ where: { id } })

const RecordsDao = {
	createRecord,
	createRecordAndLabels,
	deleteRecord,
	findAllByCounterId,
	findAllByUserId,
	findById,
}

export default RecordsDao
