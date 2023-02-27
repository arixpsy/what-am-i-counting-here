import { GITHUB_OAUTH_CLIENT_ID } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { randomBytes } from 'crypto';
import type { RequestHandler } from './$types';

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize';

export const GET: RequestHandler = ({ cookies }) => {
	const oauthState = randomBytes(16).toString('base64');
  
	cookies.set('oauth_state', oauthState, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: 600,
		path: '/'
	});

	const destination = `${GITHUB_OAUTH_URL}?client_id=${GITHUB_OAUTH_CLIENT_ID}&state=${oauthState}`;

  throw redirect(302 ,destination);
};
