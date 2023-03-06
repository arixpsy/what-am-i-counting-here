import type { NewLabel } from '@/@types/api/labels'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const createLabel = (data: NewLabel) => prisma.label.create({
	data
})

const findAllByUserId = (userId: number, searchPhrase: string) =>
	prisma.label.findMany({
		where: {
			userId,
			id: {
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

const findByLabel = (label: string) =>
	prisma.label.findUnique({
		where: {
			id: label,
		},
	})

const LabelsDao = {
	createLabel,
	findAllByUserId,
	findByLabel,
}

export default LabelsDao
