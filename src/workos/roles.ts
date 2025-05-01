import { MCPResponse, getWorkOSClient } from "../utils"

export async function listOrganizationRoles(
	env: Env,
	organizationId: string,
	limit?: number,
	after?: string,
	before?: string
) {
	const workos = getWorkOSClient(env)

	const options = {
		organizationId,
		limit,
		after,
		before
	}

	const roles = await workos.organizations.listOrganizationRoles(options)

	return MCPResponse(roles)
}
