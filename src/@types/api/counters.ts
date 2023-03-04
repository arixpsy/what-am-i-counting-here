import type { Counter } from '@prisma/client'

export type NewCounter = Pick<
	Counter,
	'title' | 'resetType' | 'target' | 'color' | 'increment' | 'userId'
>

export type GetCounterResponse = Counter & {
	currentCount: number
}
