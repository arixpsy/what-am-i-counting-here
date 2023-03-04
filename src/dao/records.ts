import { PrismaClient } from '@prisma/client'
import type { NewRecord } from '@/@types/api/records'
const prisma = new PrismaClient()

const createRecord = (data: NewRecord) =>
	prisma.record.create({
		data,
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
