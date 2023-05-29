import CountersDao from '@/dao/counters'
import type { PageServerLoad } from './$types'
import type { Counter } from '@prisma/client'
import { prisma } from '@/utils/db'
import { getDateUnitFromResetType } from '@/utils/counters'
import RecordsDao from '@/dao/records'
import { DateTime } from 'luxon'
import type { RecordsInChartFormat } from '@/@types/client/records'

export const load = (async ({ params, locals }) => {
	const SIZE = 10
	const { user } = locals
	const counterId = parseInt(params.slug)

	let counter: Counter | undefined = undefined
	let chartRecords: RecordsInChartFormat = []

	if (!isNaN(counterId)) {
		counter = (await CountersDao.findById(prisma, counterId)) || undefined
		if (counter && user) {
			const unit = getDateUnitFromResetType(counter.resetType)

			let end = DateTime.now().setZone(user.timezone)
			let start = DateTime.now().setZone(user.timezone)

			if (unit === 'year') {
				start = start.set({ millisecond: 0, second: 0, minute: 0, hour: 0, day: 1, month: 1 })
				end = end.set({ millisecond: 999, second: 59, minute: 59, hour: 23, day: 31, month: 12 })
			} else if (unit === 'month') {
				start = start.set({ millisecond: 0, second: 0, minute: 0, hour: 0, day: 1 })
				end = end.set({ millisecond: 999, second: 59, minute: 59, hour: 23, day: end.daysInMonth })
			} else if (unit === 'week') {
				start = start.set({ millisecond: 0, second: 0, minute: 0, hour: 0, weekday: 1 })
				end = end.set({ millisecond: 999, second: 59, minute: 59, hour: 23, weekday: 7 })
			} else {
				start = start.set({ millisecond: 0, second: 0, minute: 0, hour: 0 })
				end = end.set({ millisecond: 999, second: 59, minute: 59, hour: 23 })
			}

			const startFilterRange = start.minus({ [unit]: SIZE - 1 }).toJSDate()
			const endFilterRange = end.toJSDate()
			const records = await RecordsDao.findAllByCounterId(
				prisma,
				counter.id,
				startFilterRange,
				endFilterRange
			)

			for (let i = SIZE - 1; i >= 0; i--) {
				chartRecords = [
					{
						index: i,
						start: start.toSeconds(),
						end: end.toSeconds(),
						data: records.filter(
							(r) =>
								DateTime.fromJSDate(r.createdAt).toSeconds() < end.toSeconds() &&
								DateTime.fromJSDate(r.createdAt).toSeconds() > start.toSeconds()
						),
					},
					...chartRecords,
				]
				start = start.minus({ [unit]: 1 })
				end = end.minus({ [unit]: 1 })
			}
		}
	}
	return {
		counterId,
		counter,
		chartRecords,
	}
}) satisfies PageServerLoad
