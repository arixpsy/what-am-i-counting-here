import type { Counter } from '@prisma/client'

export const getCounterTypeLabel = (counter: Counter): string => {
	switch (counter.resetType) {
		case 'Year':
			return 'Yearly'
		case 'Month':
			return 'Monthly'
		case 'Week':
			return 'Weekly'
		case 'Day':
			return 'Daily'
		default:
			return ''
	}
}
