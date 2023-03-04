import type { RequestHandler } from "@sveltejs/kit"
import response from "@/utils/response"


// [POST]: api/records
//
export const POST: RequestHandler = (event) => {
  event.params
	return response.ok('success')
}


