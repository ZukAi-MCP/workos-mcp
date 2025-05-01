import type {
	CreateOrganizationOptions,
	CreateOrganizationRequestOptions,
	ListOrganizationsOptions,
	UpdateOrganizationOptions
} from "@workos-inc/node"
import { MCPResponse, getWorkOSClient } from "../utils"

export async function listOrganizations(
	env: Env,
	domains?: string[],
	limit?: number,
	before?: string,
	after?: string
) {
	const workos = getWorkOSClient(env)

	const options: ListOrganizationsOptions = {}
	if (domains) options.domains = domains
	if (limit) options.limit = limit
	if (before) options.before = before
	if (after) options.after = after

	const organizations = await workos.organizations.listOrganizations(options)

	return MCPResponse(organizations)
}

export async function createOrganization(
	env: Env,
	payload: CreateOrganizationOptions,
	requestOptions?: CreateOrganizationRequestOptions
) {
	const workos = getWorkOSClient(env)

	const organization = await workos.organizations.createOrganization(
		payload,
		requestOptions
	)

	return MCPResponse(organization)
}

export async function deleteOrganization(env: Env, id: string) {
	const workos = getWorkOSClient(env)

	await workos.organizations.deleteOrganization(id)

	return MCPResponse({ success: true, id })
}

export async function getOrganization(env: Env, id: string) {
	const workos = getWorkOSClient(env)

	const organization = await workos.organizations.getOrganization(id)

	return MCPResponse(organization)
}

export async function updateOrganization(
	env: Env,
	options: UpdateOrganizationOptions
) {
	const workos = getWorkOSClient(env)

	const organization = await workos.organizations.updateOrganization(options)

	return MCPResponse(organization)
}
