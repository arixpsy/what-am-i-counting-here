export const formatCount = (count: number) =>
	count.toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	})

export const capitalizeWord = (text: string) =>
	text
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
