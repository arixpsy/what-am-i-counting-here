import { PrismaClient, ExternalPlatform, type User } from '@prisma/client'
import type { NewUser } from '@/@types/api/users'
const prisma = new PrismaClient()

const createUser = (data: NewUser) =>
	prisma.user.create({
		data,
	})

const findById = (userId: number) =>
	prisma.user.findUnique({
		where: {
			id: userId,
		},
	})

const findByExternalPlatformId = (externalPlatform: ExternalPlatform, externalPlatformId: string) =>
	prisma.user.findFirst({
		where: {
			externalPlatform,
			externalPlatformId,
		},
	})

const updateUser = (userId: number, updatedFields: Partial<User>) =>
	prisma.user.update({
		data: updatedFields,
		where: {
			id: userId,
		},
	})

const UsersDao = {
	createUser,
	findById,
	findByExternalPlatformId,
	updateUser,
}

export default UsersDao
