import type { RequestHandler } from '@sveltejs/kit'
import type { Counter } from '@prisma/client'
import { prisma } from '@/utils/db'
import response from '@/utils/response'
import CountersDao from '@/dao/counters'

export const DELETE: RequestHandler = async ({ params, locals }) => {
	const user = locals.user
	const { slug: counterId } = params

	if (!user) {
		return response.unauthorized('user not found')
	}

	if (!counterId) {
		return response.badRequest('no counter id specified')
	}

	const counterIdInt = parseInt(counterId)

	let counter: Counter

	try {
		const existingCounter = await CountersDao.findById(prisma, counterIdInt)
		if (!existingCounter) throw new Error('counter not found')
		counter = existingCounter
	} catch {
		return response.internalServerError('counter not found')
	}

	if (counter.userId !== user.id) {
		return response.unauthorized('unable to delete a counter that is not yours')
	}

	try {
		counter = await CountersDao.deleteCounterAndRecords(prisma, counterIdInt)
	} catch {
		return response.internalServerError('unable to delete counter')
	}

	return response.ok(counter.id)
}
