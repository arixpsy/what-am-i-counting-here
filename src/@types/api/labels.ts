import type { Label } from '@prisma/client'

export type NewLabel = Pick<Label, 'id' | 'userId'>
