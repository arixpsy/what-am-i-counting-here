import { redirect } from '@sveltejs/kit'
import { ExternalPlatform, type User } from '@prisma/client'
import { DateTime } from 'luxon'
import jwt from 'jsonwebtoken'
import { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET, JWT_SECRET } from '$env/static/private'
import type { RequestHandler } from '@sveltejs/kit'
import { prisma } from '@/utils/db'
import { CookieKey, WAICH_TOKEN_LIFESPAN } from '@/@types/commons/cookies'
import { Routes } from '@/utils/routes'
import UsersDao from '@/dao/users'
import response from '@/utils/response'
import type { GithubUserDetails } from '@/@types/api/github'
import type { NewUser, VerifiedJWT } from '@/@types/api/users'

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/access_token'
const GITHUB_API_URL = 'https://api.github.com/user'

// [GET]: api/auth/github
// Acts as the authorization callback URL and verifies the state param
// by comparing it with the generated state stored in cookies.
// Retrieve Github user information via Github Api and creates a new User
// Generates a new JWT token and stores it in cookies before redirecting users to the home page
export const GET: RequestHandler = async ({ url, cookies }) => {
	const githubCode = url.searchParams.get('code')
	const oauthState = url.searchParams.get('state')
	const storedState = cookies.get(CookieKey.GITHUB_OAUTH_STATE)
	const timezone = cookies.get(CookieKey.AUTH_TIMEZONE)

	if (!githubCode) {
		return response.badRequest('github code not found')
	}

	if (oauthState !== storedState) {
		return response.badRequest('invalid state parameter')
	}

	cookies.delete(CookieKey.GITHUB_OAUTH_STATE, {
		path: '/',
	})

	cookies.delete(CookieKey.AUTH_TIMEZONE, {
		path: '/',
	})

	const oAuthSearchParams = new URLSearchParams()
	oAuthSearchParams.append('client_id', GITHUB_OAUTH_CLIENT_ID)
	oAuthSearchParams.append('client_secret', GITHUB_OAUTH_CLIENT_SECRET)
	oAuthSearchParams.append('code', githubCode)

	let githubUser: GithubUserDetails | undefined = undefined

	try {
		const githubAuthRes = await fetch(`${GITHUB_OAUTH_URL}?${oAuthSearchParams.toString()}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
			},
		})

		const { access_token } = await githubAuthRes.json()
		const userResponse = await fetch(GITHUB_API_URL, {
			headers: {
				Authorization: `Bearer ${access_token}`,
			},
		})
		githubUser = (await userResponse.json()) as GithubUserDetails
	} catch (err) {
		return response.internalServerError('unable to connect to github')
	}

	let user = undefined

	try {
		user = await UsersDao.findByExternalPlatformId(
			prisma,
			ExternalPlatform.Github,
			githubUser.id.toString()
		)
	} catch (err) {
		return response.internalServerError('unable to login')
	}

	if (!user) {
		const newUser: NewUser = {
			avatarUrl: githubUser.avatar_url,
			displayName: githubUser.name,
			externalPlatform: ExternalPlatform.Github,
			externalPlatformId: githubUser.id.toString(),
		}

		if (timezone) {
			newUser.timezone = timezone
		}

		user = await UsersDao.createUser(prisma, newUser)
	}

	const updatedUserFields: Partial<User> = {}

	if (user.avatarUrl !== githubUser.avatar_url) {
		updatedUserFields.avatarUrl = githubUser.avatar_url
	}

	if (user.displayName !== githubUser.name) {
		updatedUserFields.displayName = githubUser.name
	}

	const jwtData: VerifiedJWT = {
		id: user.id,
		avatarUrl: githubUser.avatar_url,
		displayName: githubUser.name,
	}

	const newJwt = jwt.sign(jwtData, JWT_SECRET)

	updatedUserFields.clientToken = newJwt
	updatedUserFields.tokenExpiration = DateTime.now()
		.plus({ millisecond: WAICH_TOKEN_LIFESPAN })
		.toJSDate()

	try {
		user = await UsersDao.updateUser(prisma, user.id, updatedUserFields)
	} catch (err) {
		return response.internalServerError('unable to login')
	}

	cookies.set(CookieKey.WAICH_TOKEN, newJwt, {
		path: '/',
		sameSite: 'lax',
		httpOnly: true,
		secure: true,
		maxAge: WAICH_TOKEN_LIFESPAN,
	})

	throw redirect(302, Routes.HOME)
}
