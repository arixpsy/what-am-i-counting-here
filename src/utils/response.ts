const response: Record<string, (body: BodyInit) => Response> = {
	ok: (body) => new Response(body, { status: 200 }),
	created: (body) => new Response(body, { status: 201 }),
	badRequest: (body) => new Response(body, { status: 400 }),
	unauthorized: (body) => new Response(body, { status: 401 }),
	internalServerError: (body) => new Response(body, { status: 500 })
}

export default response
