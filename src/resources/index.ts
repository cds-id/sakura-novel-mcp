import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { infoResource } from './infoResource.js';
import { greetingResource } from './greetingResource.js';
import { translationGuideResource } from './translationGuideResource.js';

/**
 * Register all resources with the MCP server
 * @param server The MCP server instance
 */
export function registerResources(server: McpServer): void {
  // Register the info resource
  infoResource(server);

  // Register the greeting resource
  greetingResource(server);

  // Register the translation guide resource
  translationGuideResource(server);

  // Add more resources here
}
