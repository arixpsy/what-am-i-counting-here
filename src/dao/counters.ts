import type { PrismaClientOrTransaction } from '@/@types/commons/prisma'
import type { NewCounter } from '@/@types/api/counters'

const createCounter = (db: PrismaClientOrTransaction, data: NewCounter) =>
	db.counter.create({
		data,
	})

const deleteCounter = (db: PrismaClientOrTransaction, id: number) =>
	db.counter.delete({
		where: {
			id,
		},
	})

const findAllByUserId = (db: PrismaClientOrTransaction, userId: number) =>
	db.counter.findMany({
		where: {
			userId,
		},
		orderBy: [
			{
				id: 'asc',
			},
		],
	})

const findById = (db: PrismaClientOrTransaction, id: number) =>
	db.counter.findUnique({
		where: {
			id,
		},
	})

const CountersDao = {
	createCounter,
	deleteCounter,
	findAllByUserId,
	findById,
}

export default CountersDao
