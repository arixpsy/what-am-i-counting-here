import type { ExternalPlatform, User } from '@prisma/client'
import type { PrismaClientOrTransaction } from '@/@types/commons/prisma'
import type { NewUser } from '@/@types/api/users'

const createUser = (db: PrismaClientOrTransaction, data: NewUser) =>
	db.user.create({
		data,
	})

const findById = (db: PrismaClientOrTransaction, id: number) =>
	db.user.findUnique({
		where: {
			id,
		},
	})

const findByExternalPlatformId = (
	db: PrismaClientOrTransaction,
	externalPlatform: ExternalPlatform,
	externalPlatformId: string
) =>
	db.user.findFirst({
		where: {
			externalPlatform,
			externalPlatformId,
		},
	})

const updateUser = (db: PrismaClientOrTransaction, id: number, updatedFields: Partial<User>) =>
	db.user.update({
		data: updatedFields,
		where: {
			id,
		},
	})

const UsersDao = {
	createUser,
	findById,
	findByExternalPlatformId,
	updateUser,
}

export default UsersDao
