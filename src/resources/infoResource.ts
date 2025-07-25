import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * A simple static info resource that provides basic information about the server
 * @param server The MCP server instance
 */
export function infoResource(server: McpServer): void {
  // Define server info separately since we can't access name/version directly
  const serverInfo = {
    name: 'MCP-Boilerplate',
    version: '1.0.0',
  };

  server.resource('info', 'info://server', async uri => ({
    contents: [
      {
        uri: uri.href,
        text: `
# MCP Server Boilerplate
- Name: ${serverInfo.name}
- Version: ${serverInfo.version}
- Server Time: ${new Date().toISOString()}
- Environment: ${process.env.NODE_ENV || 'development'}

This is a boilerplate MCP server implementation using the Model Context Protocol TypeScript SDK.

## Features:
- Fetch latest novels from sakuranovel.id
- Fetch novel details and chapter lists
- Fetch and parse chapter content
- **Translation Correction Support**: Automatically detect and correct common machine translation errors in Indonesian light novel content

## Translation Correction Capabilities:
- Corrects race/species mistranslations (e.g., "Kulit Binatang" → "Ras Binatang")
- Preserves gaming/fantasy terminology appropriately
- Fixes awkward sentence structures
- Maintains consistency in character pronouns
- Natural Indonesian phrasing improvements

Use the 'correct-translation' prompt for guidance or the 'apply-translation-corrections' tool for automatic corrections.
`,
      },
    ],
  }));
}
