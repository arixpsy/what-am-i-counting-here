import type { Counter, Record } from '@prisma/client'
import type { GetCounterResponse } from '@/@types/api/counters'

export const updateCountersCacheWithNewCounter = (
	currentCache: Array<GetCounterResponse>,
	newCounter: Counter
) => {
	const newCache: Array<GetCounterResponse> = [...currentCache]

	newCache.push({
		...newCounter,
		currentCount: 0,
	})

	return newCache
}

export const updateCounterCacheWithRecord = (
	currentCache: Array<GetCounterResponse>,
	record: Record
) => {
	const newCache: Array<GetCounterResponse> = []

	for (const counter of currentCache) {
		if (counter.id === record.counterId) {
			newCache.push({
				...counter,
				currentCount: counter.currentCount + record.increment,
			})
		} else {
			newCache.push(counter)
		}
	}
	return newCache
}
