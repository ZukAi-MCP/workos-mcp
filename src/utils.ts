import { WorkOS } from "@workos-inc/node"

export function MCPResponse(data: unknown) {
	return {
		content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
	}
}

export function getWorkOSClient(env: Env) {
	return new WorkOS(env.WORKOS_API_KEY, {
		clientId: env.WORKOS_CLIENT_ID
	})
}
