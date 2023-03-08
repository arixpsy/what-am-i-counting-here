import type { Label } from '@prisma/client'
import type { PrismaClientOrTransaction } from '@/@types/commons/prisma'

const createLabel = (db: PrismaClientOrTransaction, userId: number, value: string) =>
	db.label.create({
		data: {
			userId,
			value,
		},
	})

const findAllByUserId = (db: PrismaClientOrTransaction, userId: number, searchPhrase: string) =>
	db.label.findMany({
		where: {
			userId,
			value: {
				contains: searchPhrase,
				mode: 'insensitive',
			},
		},
		orderBy: [
			{
				lastUsed: 'desc',
			},
		],
		take: 5,
	})

const findByUserIdAndLabel = (db: PrismaClientOrTransaction, userId: number, value: string) =>
	db.label.findFirst({
		where: {
			userId,
			value,
		},
	})

const updateLabel = (db: PrismaClientOrTransaction, id: number, data: Partial<Label>) =>
	db.label.update({
		data,
		where: {
			id,
		},
	})

const LabelsDao = {
	createLabel,
	findAllByUserId,
	findByUserIdAndLabel,
	updateLabel,
}

export default LabelsDao
