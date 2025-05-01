import type {
	CreateOrganizationMembershipOptions,
	ListOrganizationMembershipsOptions,
	OrganizationMembershipStatus,
	UpdateOrganizationMembershipOptions
} from "@workos-inc/node"
import { MCPResponse, getWorkOSClient } from "../utils"

export async function getOrganizationMembership(
	env: Env,
	membershipId: string
) {
	const workos = getWorkOSClient(env)

	const membership =
		await workos.userManagement.getOrganizationMembership(membershipId)

	return MCPResponse(membership)
}

export async function listOrganizationMemberships(
	env: Env,
	organizationId?: string,
	userId?: string,
	statuses?: string[],
	limit?: number,
	before?: string,
	after?: string
) {
	const workos = getWorkOSClient(env)

	const options: ListOrganizationMembershipsOptions = {}
	if (organizationId) options.organizationId = organizationId
	if (userId) options.userId = userId
	if (statuses) options.statuses = statuses as OrganizationMembershipStatus[]
	if (limit) options.limit = limit
	if (before) options.before = before
	if (after) options.after = after

	const memberships =
		await workos.userManagement.listOrganizationMemberships(options)

	return MCPResponse(memberships)
}

export async function createOrganizationMembership(
	env: Env,
	options: CreateOrganizationMembershipOptions
) {
	const workos = getWorkOSClient(env)

	const membership =
		await workos.userManagement.createOrganizationMembership(options)

	return MCPResponse(membership)
}

export async function updateOrganizationMembership(
	env: Env,
	membershipId: string,
	options: UpdateOrganizationMembershipOptions
) {
	const workos = getWorkOSClient(env)

	const membership = await workos.userManagement.updateOrganizationMembership(
		membershipId,
		options
	)

	return MCPResponse(membership)
}

export async function deleteOrganizationMembership(
	env: Env,
	membershipId: string
) {
	const workos = getWorkOSClient(env)

	await workos.userManagement.deleteOrganizationMembership(membershipId)

	return MCPResponse({ success: true, id: membershipId })
}

export async function deactivateOrganizationMembership(
	env: Env,
	membershipId: string
) {
	const workos = getWorkOSClient(env)

	const membership =
		await workos.userManagement.deactivateOrganizationMembership(
			membershipId
		)

	return MCPResponse(membership)
}

export async function reactivateOrganizationMembership(
	env: Env,
	membershipId: string
) {
	const workos = getWorkOSClient(env)

	const membership =
		await workos.userManagement.reactivateOrganizationMembership(
			membershipId
		)

	return MCPResponse(membership)
}
