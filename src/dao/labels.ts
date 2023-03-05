import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const findAllByUserId = (userId: number, searchPhrase: string) =>
	prisma.label.findMany({
		where: {
			userId,
			id: {
				contains: searchPhrase,
			},
		},
		orderBy: [
			{
				lastUsed: 'desc',
			},
		],
		take: 5,
	})

const LabelsDao = {
	findAllByUserId,
}

export default LabelsDao
