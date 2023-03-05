export const formatCount = (count: number) =>
	(count).toLocaleString(undefined, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	})
