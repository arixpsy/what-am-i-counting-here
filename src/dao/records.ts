import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

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
	findAllByCounterId,
}

export default RecordsDao
