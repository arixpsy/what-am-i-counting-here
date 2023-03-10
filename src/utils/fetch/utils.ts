export const objectToURLSearchParams = (data: object) => {
	const params = new URLSearchParams()
	Object.entries(data).forEach(([k, v]) => {
		if (v === undefined) return
		params.set(k, v.toString())
	})
	return params
}
