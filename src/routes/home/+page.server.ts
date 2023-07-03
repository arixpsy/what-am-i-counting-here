import CountersDao from '@/dao/counters'
import type { PageServerLoad } from './$types'
import { prisma } from '@/utils/db'
import RecordsDao from '@/dao/records'
import type { GetCounterResponse } from '@/@types/api/counters'
import { accumulateRecordIncrements, getDefaultRecordFilterRange } from '@/utils/counters'

export const load = (async ({ locals }) => {
	const { user } = locals
	const counters: Array<GetCounterResponse> = []

	if (user) {
    const userCounters = await CountersDao.findAllByUserId(prisma, user.id)

    for (const counter of userCounters) {
      const [startRange, endRange] = getDefaultRecordFilterRange(counter, user)
  
      const records = await RecordsDao.findAllByCounterId(prisma, counter.id, startRange, endRange)
  
      counters.push({
        ...counter,
        currentCount: accumulateRecordIncrements(records),
      })
    }
	}

	return {
		counters,
	}
}) satisfies PageServerLoad
