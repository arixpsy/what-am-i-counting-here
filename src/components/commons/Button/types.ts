export const ButtonColor = {
	PRIMARY: 'primary',
	DEFAULT: 'default'
} as const;

export type IButtonColor = typeof ButtonColor[keyof typeof ButtonColor]
