import type { PageServerLoad } from './$types'
import { prisma } from '@/utils/db'
import RecordsDao from '@/dao/records'
import type { GetRecordHistoryResponse } from '@/@types/api/records'

export const load = (async ({ locals }) => {
	const SIZE = 10
	const { user } = locals
	const records: GetRecordHistoryResponse = {
		data: [],
	}

	if (user) {
		const userRecords = await RecordsDao.findAllByUserId(
			prisma,
			SIZE,
			user.id,
			undefined,
			undefined
		)
		const cursorNext = userRecords.length ? userRecords[userRecords.length - 1].id : undefined

		records.cursorNext = cursorNext
		records.data = userRecords
	}

	return {
		records,
	}
}) satisfies PageServerLoad
