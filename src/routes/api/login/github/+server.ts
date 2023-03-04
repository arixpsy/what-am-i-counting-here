import { GITHUB_OAUTH_CLIENT_ID } from '$env/static/private'
import { CookieKey } from '@/@types/commons/cookies'
import { redirect } from '@sveltejs/kit'
import randomBytes from 'random-bytes'
import type { RequestHandler } from './$types'

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'

// [GET]: api/login/github
// Generates a oauth state parameter and stores it as a cookie for 10 minutes.
// Redirect users to github's oauth authorize endpoint with the client id and state in URLSearchParams.
export const GET: RequestHandler = async ({ cookies, url }) => {
	const oauthState = randomBytes.sync(16).toString('base64')
	const timezone = url.searchParams.get('tz')

	cookies.set(CookieKey.GITHUB_OAUTH_STATE, oauthState, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		maxAge: 600,
		path: '/'
	})

	if (timezone) {
		cookies.set(CookieKey.AUTH_TIMEZONE, timezone, {
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 600,
			path: '/'
		})
	}

	const authSearchParams = new URLSearchParams()
	authSearchParams.append('client_id', GITHUB_OAUTH_CLIENT_ID)
	authSearchParams.append('state', oauthState)

	const destination = `${GITHUB_AUTHORIZE_URL}?${authSearchParams.toString()}`

	throw redirect(302, destination)
}
