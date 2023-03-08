import { redirect, type Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import { CookieKey } from '@/@types/commons/cookies'
import UsersDao from '@/dao/users'
import { AUTH_PAGE_ROUTES, Routes } from '@/utils/routes'
import type { VerifiedJWT } from '@/@types/api/users'
import { prisma } from '@/utils/db'

const getUserFromCookie: Handle = async ({ event, resolve }) => {
	const authToken = event.cookies.get(CookieKey.WAICH_TOKEN)

	if (!authToken) {
		event.locals.user = undefined
		return resolve(event)
	}

	try {
		const decodedJwt = jwt.verify(authToken, JWT_SECRET) as VerifiedJWT
		event.locals.user = (await UsersDao.findById(prisma, decodedJwt.id)) || undefined
	} catch (err) {
		event.locals.user = undefined
	}

	return resolve(event)
}

const redirectIfAuthenticated: Handle = async ({ event, resolve }) => {
	const isAccessingLoginPage = event.route.id === Routes.LOGIN
	const isAuthenticated = !!event.locals.user

	if (isAccessingLoginPage && isAuthenticated) {
		throw redirect(302, Routes.HOME)
	}

	return resolve(event)
}

const redirectIfNotAuthenticated: Handle = async ({ event, resolve }) => {
	const isAuthenticated = !!event.locals.user
	const route = event.route.id as (typeof AUTH_PAGE_ROUTES)[number]
	const isAuthPageRoute = AUTH_PAGE_ROUTES.includes(route)

	if (!isAuthenticated && isAuthPageRoute) {
		throw redirect(302, Routes.LOGIN)
	}

	return resolve(event)
}

export const handle = sequence(
	getUserFromCookie,
	redirectIfAuthenticated,
	redirectIfNotAuthenticated
)
