# workos-mcp

This is a lightweight Model Control Protocol (MCP) server bootstrapped with [create-mcp](https://github.com/zueai/create-mcp), and deployed on Cloudflare Workers.

This MCP Server allows agents (like Cursor Agents) to interact with the [WorkOS API](https://workos.com/docs/reference).

## Available Tools

See [src/index.ts](src/index.ts) for the current list of tools. Every method in the class is an MCP tool.

## Installation

1. Run the automated install script to clone this MCP server and deploy it to your Cloudflare account:

```bash
bun create mcp --clone https://github.com/zueai/workos-mcp
```

2. Open `Cursor Settings -> MCP -> Add new MCP server` and paste the command that was copied to your clipboard.

3. Upload your WorkOS API key and client ID as secrets:

```bash
bunx wrangler secret put WORKOS_API_KEY
bunx wrangler secret put WORKOS_CLIENT_ID
```

## Deploying Changes

1. Run the deploy script:

```bash
bun run deploy
```

2. Then reload your Cursor window to use the updated tools.

## How to create new MCP tools

To create new MCP tools, add methods to the `MyWorker` class in `src/index.ts`. Each function will automatically become an MCP tool that your agent can use.

Example:

```typescript
/**
 * A warm, friendly greeting from your MCP server.
 * @param name {string} the name of the person we are greeting.
 * @return {string} the contents of our greeting.
 */
sayHello(name: string) {
    return `Hello from an MCP Worker, ${name}!`;
}
```

The JSDoc comments are important:

- First line becomes the tool's description
- `@param` tags define the tool's parameters with types and descriptions
- `@return` tag specifies the return value and type

