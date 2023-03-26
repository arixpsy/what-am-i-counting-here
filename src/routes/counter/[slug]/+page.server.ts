import CountersDao from '@/dao/counters'
import type { PageServerLoad } from './$types'
import type { Counter } from '@prisma/client'
import { prisma } from '@/utils/db'
import { accumulateRecordIncrements, getDefaultRecordFilterRange } from '@/utils/counters'
import RecordsDao from '@/dao/records'

export const load = (async ({ params, locals }) => {
  const { user } = locals
	const counterId = parseInt(params.slug)

	let counter: Counter | undefined = undefined
  let currentCount = 0

	if (!isNaN(counterId)) {
		counter = await CountersDao.findById(prisma, counterId) || undefined
    if (counter && user) {
      const [startRange, endRange] = getDefaultRecordFilterRange(counter, user)
      const records = await RecordsDao.findAllByCounterId(prisma, counter.id, startRange, endRange)
      currentCount = accumulateRecordIncrements(records)
    }
	}

	return {
		counterId,
		counter,
    currentCount,
	}
}) satisfies PageServerLoad
