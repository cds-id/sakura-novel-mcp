import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { calculatorTool } from './calculatorTool.js';
import { timestampTool } from './timestampTool.js';
import { fetchLatestNovelTool } from './fetchLatestNovelTool.js';
import { fetchNovelDetailsTool } from './fetchNovelDetailsTool.js';
import { fetchChapterContentTool } from './fetchChapterContentTool.js';
import { applyTranslationCorrectionsTool } from './applyTranslationCorrectionsTool.js';
import { searchNovelsTool } from './searchNovelsTool.js';

/**
 * Register all tools with the MCP server
 * @param server The MCP server instance
 */
export function registerTools(server: McpServer): void {
  // Register calculator tool
  calculatorTool(server);

  // Register timestamp tool
  timestampTool(server);

  // Register fetch latest novel tool
  fetchLatestNovelTool(server);

  // Register fetch novel details tool
  fetchNovelDetailsTool(server);

  // Register fetch chapter content tool
  fetchChapterContentTool(server);

  // Register apply translation corrections tool
  applyTranslationCorrectionsTool(server);

  // Register search novels tool
  searchNovelsTool(server);

  // Add more tools here
}
