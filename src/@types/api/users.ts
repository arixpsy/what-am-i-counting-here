import type { User } from '@prisma/client'

export type NewUser = Pick<
	User,
	'externalPlatform' | 'externalPlatformId' | 'avatarUrl' | 'displayName'
>

export type VerifiedJWT = {
	id: number
	avatarUrl: string
	displayName: string
}
