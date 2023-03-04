const response: Record<string, (body: string | object | number) => Response> = {
	ok: (body) => new Response(constructBody(body), constructOptions(200)),
	created: (body) => new Response(constructBody(body), constructOptions(201)),
	badRequest: (body) => new Response(constructBody(body), constructOptions(400)),
	unauthorized: (body) => new Response(constructBody(body), constructOptions(401)),
	internalServerError: (body) => new Response(constructBody(body), constructOptions(500)),
}

function constructBody(body: string | object | number): BodyInit {
	if (typeof body === 'string') {
		return body
	} else if (typeof body === 'number') {
		return body.toString()
	}
	return JSON.stringify(body)
}

function constructOptions(status: number): ResponseInit {
	return {
		status,
		headers: {
			'Content-Type': 'application/json',
		},
	}
}
export default response
