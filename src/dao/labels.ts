import type { NewLabel } from '@/@types/api/labels'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const createLabel = (data: NewLabel) =>
	prisma.label.create({
		data,
	})

const findAllByUserId = (userId: number, searchPhrase: string) =>
	prisma.label.findMany({
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

const findByLabel = (userId: number, value: string) =>
	prisma.label.findFirst({
		where: {
			userId,
			value,
		},
	})

const LabelsDao = {
	createLabel,
	findAllByUserId,
	findByLabel,
}

export default LabelsDao
