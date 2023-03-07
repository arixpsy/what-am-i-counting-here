import { PrismaClient } from '@prisma/client'
import type { NewRecordRequest } from '@/@types/client/records'
const prisma = new PrismaClient()

const createRecord = (userId: number, data: NewRecordRequest) =>
	prisma.$transaction(async (tx) => {
		const labelIds: Array<{ id: number }> = []
		const { increment, counterId, description } = data

		for (const value of data.labels) {
			const existingLabel = await tx.label.findFirst({
				where: {
					userId,
					value,
				},
			})
			if (!existingLabel) {
				const newLabel = await tx.label.create({
					data: {
						userId,
						value,
					},
				})
				labelIds.push({ id: newLabel.id })
			} else {
				await tx.label.update({
					data: {
						lastUsed: new Date(),
					},
					where: {
						id: existingLabel.id,
					},
				})
				labelIds.push({ id: existingLabel.id })
			}
		}

		const record = await tx.record.create({
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

		return record
	})

const findAllByCounterId = (counterId: number, startRange: Date, endRange: Date) =>
	prisma.record.findMany({
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
	findAllByCounterId,
}

export default RecordsDao
