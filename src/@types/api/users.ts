import type { User } from '@prisma/client'

export type NewUser = Pick<
	User,
	'externalPlatform' | 'externalPlatformId' | 'avatarUrl' | 'displayName'
> & {
	timezone?: string
}

export type VerifiedJWT = Pick<User, 'id' | 'avatarUrl' | 'displayName'>
