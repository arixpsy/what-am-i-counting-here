import { ResetType } from '@prisma/client'
import type { DateTime } from 'luxon'

export const CounterBarChartXAxisLabel = (
	dateTime: DateTime,
	resetType: ResetType,
	isLastColumn: boolean
) => {
	if (isLastColumn) {
		return XAxisLabelByResetType(resetType)
	}
	switch (resetType) {
		case ResetType.Year:
			return dateTime.toFormat('yyyy')
		case ResetType.Month:
			return dateTime.toFormat('LLL yy')
		case ResetType.Week:
		case ResetType.Day:
		default:
			return dateTime.toFormat('d LLL')
	}
}

const XAxisLabelByResetType = (resetType: ResetType) => {
	switch (resetType) {
		case ResetType.Year:
			return 'This Year'
		case ResetType.Month:
			return 'This Month'
		case ResetType.Week:
			return 'This Week'
		case ResetType.Day:
		default:
			return 'Today'
	}
}
