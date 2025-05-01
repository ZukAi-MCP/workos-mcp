import type {
	CreateUserOptions,
	ListUsersOptions,
	UpdateUserOptions
} from "@workos-inc/node"
import { MCPResponse, getWorkOSClient } from "../utils"

export async function listUsers(
	env: Env,
	email?: string,
	organizationId?: string,
	limit?: number,
	before?: string,
	after?: string
) {
	const workos = getWorkOSClient(env)

	const options: ListUsersOptions = {}
	if (email) options.email = email
	if (organizationId) options.organizationId = organizationId
	if (limit) options.limit = limit
	if (before) options.before = before
	if (after) options.after = after

	const users = await workos.userManagement.listUsers(options)

	return MCPResponse(users)
}

export async function getUser(env: Env, userId: string) {
	const workos = getWorkOSClient(env)

	const user = await workos.userManagement.getUser(userId)

	return MCPResponse(user)
}

export async function createUser(env: Env, payload: CreateUserOptions) {
	const workos = getWorkOSClient(env)

	const user = await workos.userManagement.createUser(payload)

	return MCPResponse(user)
}

export async function updateUser(env: Env, options: UpdateUserOptions) {
	const workos = getWorkOSClient(env)

	const user = await workos.userManagement.updateUser(options)

	return MCPResponse(user)
}

export async function deleteUser(env: Env, userId: string) {
	const workos = getWorkOSClient(env)

	await workos.userManagement.deleteUser(userId)

	return MCPResponse({ success: true, id: userId })
}

export async function listIdentities(env: Env, userId: string) {
	const workos = getWorkOSClient(env)

	const identities = await workos.userManagement.getUserIdentities(userId)

	return MCPResponse(identities)
}
