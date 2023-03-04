import type { GetCounterResponse } from "@/@types/api/counters"
import type { NewCounterRequest } from "@/@types/client/counters"
import type { Counter } from "@prisma/client"

const ROUTE = '/api/counters'

export const getCounters = async () => {
  const response = await fetch(ROUTE)
  const data = (await response.json()) as Array<GetCounterResponse>
  return data
}

export const createCounter = async (body: NewCounterRequest) => {
  const response = await fetch(ROUTE, {
    method: 'POST',
    body: JSON.stringify(body)
  })
  const data = (await response.json()) as Counter
  return data
}
