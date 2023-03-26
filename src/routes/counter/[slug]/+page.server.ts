import CountersDao from '@/dao/counters'
import type { PageServerLoad } from './$types'
import type { Counter } from '@prisma/client'
import { prisma } from '@/utils/db'
import { accumulateRecordIncrements, getDateUnitFromResetType } from '@/utils/counters'
import RecordsDao from '@/dao/records'
import { DateTime } from 'luxon'
import type { RecordsInChartFormat } from '@/@types/client/records'

export const load = (async ({ params, locals }) => {
	const SIZE = 10
	const { user } = locals
	const counterId = parseInt(params.slug)

	let counter: Counter | undefined = undefined
	let currentCount = 0
	let chartRecords: RecordsInChartFormat = []

	if (!isNaN(counterId)) {
		counter = (await CountersDao.findById(prisma, counterId)) || undefined
		if (counter && user) {
			const unit = getDateUnitFromResetType(counter.resetType)


			// TODO: clean up
			let end = DateTime.now()
				.setZone(user.timezone)
				.set({ millisecond: -1, second: 0, minute: 0, hour: 0 })
				.plus({ day: 1 })
			const startFilter = end.minus({ [unit]: SIZE })
			let start = end.minus({ [unit]: 1 })

			const records = await RecordsDao.findAllByCounterId(
				prisma,
				counter.id,
				startFilter.toJSDate(),
				end.toJSDate()
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

			currentCount = accumulateRecordIncrements(chartRecords[chartRecords.length - 1].data)
		}
	}
	return {
		counterId,
		counter,
		currentCount,
		chartRecords,
	}
}) satisfies PageServerLoad
