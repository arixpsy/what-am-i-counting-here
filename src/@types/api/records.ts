import type { Record } from '@prisma/client'

export type NewRecord = Pick<Record, 'counterId' | 'description' | 'increment'>
