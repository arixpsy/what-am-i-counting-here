import type { PrismaClient } from '@prisma/client'

export type PrismaClientOrTransaction = PrismaClient | Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>
