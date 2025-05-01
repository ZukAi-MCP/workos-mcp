import type { EventName } from "@workos-inc/node"
import { MCPResponse, getWorkOSClient } from "../utils"

export async function listEvents(
	env: Env,
	events: EventName[],
	rangeStart?: string,
	rangeEnd?: string,
	limit?: number,
	after?: string,
	organizationId?: string
) {
	const workos = getWorkOSClient(env)

	const options: {
		events: EventName[]
		rangeStart?: string
		rangeEnd?: string
		limit?: number
		after?: string
		organizationId?: string
	} = {
		events
	}

	if (rangeStart) options.rangeStart = rangeStart
	if (rangeEnd) options.rangeEnd = rangeEnd
	if (limit) options.limit = limit
	if (after) options.after = after
	if (organizationId) options.organizationId = organizationId

	const listOfEvents = await workos.events.listEvents(options)

	return MCPResponse(listOfEvents)
}
