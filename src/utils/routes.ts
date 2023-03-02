export const Routes = {
	// API
	GITHUB_AUTHORIZATION: '/api/login/github',

	// PAGES
	LOGIN: '/',
	HOME: '/home',
	COUNTER: '/counter',
	HISTORY: '/history',
} as const

export type Routes = (typeof Routes)[keyof typeof Routes]

export const AUTH_PAGE_ROUTES = [Routes.HOME, Routes.COUNTER, Routes.HISTORY] as const

export const PAGE_ROUTES = [Routes.LOGIN, ...AUTH_PAGE_ROUTES] as const
