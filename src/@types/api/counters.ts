import { z } from 'zod'
import colors from 'tailwindcss/colors'
import { ResetType } from '@prisma/client'

export const CounterColors = [
	colors.zinc[400],
	colors.neutral[400],
	colors.slate[400],
	colors.slate[500],
	colors.yellow[600],
	colors.orange[500],
	colors.orange[400],
	colors.amber[400],
	colors.yellow[400],
	colors.lime[500],
	colors.emerald[500],
	colors.green[600],
	colors.teal[500],
	colors.teal[400],
	colors.cyan[600],
	colors.blue[300],
	colors.blue[400],
	colors.blue[500],
	colors.indigo[300],
	colors.indigo[400],
	colors.violet[300],
	colors.violet[400],
	colors.purple[300],
	colors.purple[400],
	colors.purple[500],
	colors.fuchsia[300],
	colors.pink[300],
	colors.pink[400],
	colors.pink[500],
	colors.rose[300],
	colors.rose[400],
] as const

export type CounterColors = (typeof CounterColors)[number]

export const CounterFormSchema = z.object({
	title: z.string().min(1, 'Cannot be empty').max(15, 'Too Long'),
	resetType: z.nativeEnum(ResetType),
	hasTarget: z.boolean(),
	target: z.number().min(0, 'Targets should be 0 or more'),
	color: z.enum(CounterColors),
	hasCustomIncrement: z.boolean(),
	incrementValue: z.number().min(0, 'Increments should be 0 or more'),
})
