import { ResetType, type Counter, type User, type Record } from '@prisma/client'
import { DateTime } from 'luxon'

export function getDefaultRecordFilterRange(counter: Counter, user: User) {
	const { resetType } = counter
	const [startRange, endRange] = getRecordFilterRangeByType(user, resetType)
	return [startRange, endRange]
}

export function getRecordFilterRangeByType(user: User, resetType: ResetType): [s: Date, e: Date] {
	let startRange = new Date()
	let endRange = new Date()
	const { timezone, createdAt: userCreatedAt } = user

	if (resetType === ResetType.Never) {
		startRange = new Date(userCreatedAt)
	} else {
		startRange = DateTime.now()
			.setZone(timezone)
			.startOf(getDateUnitFromResetType(resetType))
			.toJSDate()
	}

	endRange = DateTime.now()
		.setZone(timezone)
		.set({ millisecond: -1, second: 0, minute: 0, hour: 0 })
		.plus({ days: 1 })
		.toJSDate()

	return [startRange, endRange]
}

export function accumulateRecordIncrements(records: Array<Record>) {
	return records.reduce((total, r) => total + r.increment, 0)
}

export function getDateUnitFromResetType(resetType: ResetType) {
	switch (resetType) {
		case ResetType.Year:
			return 'year'
		case ResetType.Month:
			return 'month'
		case ResetType.Week:
			return 'week'
		case ResetType.Day:
		default:
			return 'day'
	}
}
