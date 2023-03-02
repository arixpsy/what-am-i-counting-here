import { redirect, type RequestHandler } from '@sveltejs/kit'
import { CookieKey } from '@/@types/commons/cookies'
import { Routes } from '@/utils/routes'

// [GET]: api/logout
// Clears the users auth cookie and redirects them to the login page
export const GET: RequestHandler = ({ cookies }) => {
	cookies.delete(CookieKey.WAICH_TOKEN, {
		path: '/',
	})

	throw redirect(302, Routes.LOGIN)
}
