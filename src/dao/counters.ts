import type { PrismaClient } from '@prisma/client'
import type { PrismaClientOrTransaction } from '@/@types/commons/prisma'
import type { NewCounter } from '@/@types/api/counters'

const createCounter = (db: PrismaClientOrTransaction, data: NewCounter) =>
	db.counter.create({
		data,
	})

const deleteCounterAndRecords = (db: PrismaClient, id: number) =>
	db.$transaction(async (tx) => {
		await tx.record.deleteMany({
			where: {
				counterId: id,
			},
		})

		const counter = await tx.counter.delete({
			where: {
				id,
			},
		})

		return counter
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
	deleteCounterAndRecords,
	findAllByUserId,
	findById,
}

export default CountersDao
