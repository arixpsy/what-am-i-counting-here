import type { RequestHandler } from './$types'
import { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_CLIENT_SECRET } from '$env/static/private'
import { CookieKey } from '@/@types/commons/cookies'
import { redirect } from '@sveltejs/kit'
import { Routes } from '@/utils/routes'

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

	if (!githubCode) {
		return new Response('github code not found', {
			status: 400
		})
	}

	if (oauthState !== storedState) {
		return new Response('invalid state parameter', {
			status: 400
		})
	}

	cookies.delete(CookieKey.GITHUB_OAUTH_STATE, {
		path: '/'
	})

	const oAuthSearchParams = new URLSearchParams()
	oAuthSearchParams.append('client_id', GITHUB_OAUTH_CLIENT_ID)
	oAuthSearchParams.append('client_secret', GITHUB_OAUTH_CLIENT_SECRET)
	oAuthSearchParams.append('code', githubCode)

	let user = undefined

	try {
		const githubAuthRes = await fetch(`${GITHUB_OAUTH_URL}?${oAuthSearchParams.toString()}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json'
			}
		})

		const { access_token } = await githubAuthRes.json()
		const userResponse = await fetch(GITHUB_API_URL, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		})
		user = await userResponse.json()
	} catch (err) {
		return new Response('unable to connect to github', { status: 500 })
	}

	// TODO: create/save user to db
	// TODO: create JWT token for user and set cookie
	console.debug(user)

	throw redirect(302, Routes.HOME)
}
