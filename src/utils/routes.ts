export const Routes = {
	// API
	GITHUB_AUTHORIZATION: '/api/login/github',
	LOGOUT: '/api/logout',

	// PAGES
	LOGIN: '/',
	HOME: '/home',
	COUNTER: '/counter',
	HISTORY: '/history',
	OPTIONS: '/options',
} as const

export type Routes = (typeof Routes)[keyof typeof Routes]

export const AUTH_PAGE_ROUTES = [
	Routes.HOME,
	Routes.COUNTER,
	Routes.HISTORY,
	Routes.OPTIONS,
] as const

export const PAGE_ROUTES = [Routes.LOGIN, ...AUTH_PAGE_ROUTES] as const
