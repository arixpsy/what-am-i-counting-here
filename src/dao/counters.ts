import { PrismaClient } from '@prisma/client'
import type { NewCounter } from '@/@types/api/counters'
const prisma = new PrismaClient()

const createCounter = (data: NewCounter) =>
	prisma.counter.create({
		data,
	})

const deleteCounter = (id: number) =>
	prisma.counter.delete({
		where: {
			id,
		},
	})

const findAllByUserId = (userId: number) =>
	prisma.counter.findMany({
		where: {
			userId,
		},
		orderBy: [
			{
				id: 'asc',
			},
		],
	})

const findById = (counterId: number) =>
	prisma.counter.findUnique({
		where: {
			id: counterId,
		},
	})

const CountersDao = {
	createCounter,
	deleteCounter,
	findAllByUserId,
	findById,
}

export default CountersDao
