import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import type { Novel, LatestNovelsResponse } from '../types/novel.types.js';
import { httpConfig } from '../config/httpConfig.js';

/**
 * A tool that fetches the latest novels from sakuranovel.id
 * @param server The MCP server instance
 */
export function fetchLatestNovelTool(server: McpServer): void {
  server.tool(
    'fetch-latest-novels',
    {
      page: z.number().min(1).optional().default(1),
      limit: z.number().min(1).max(50).optional().default(20),
    },
    async ({ page, limit }) => {
      try {
        const url = page === 1 ? 'https://sakuranovel.id/' : `https://sakuranovel.id/page/${page}/`;

        const response = await fetch(url, {
          headers: httpConfig.getHeaders(),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Response error body:', errorBody);
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const novels: Novel[] = [];

        // Parse each novel item
        $('.flexbox3-item').each((index, element) => {
          if (index >= limit) return false; // Stop after limit

          const $item = $(element);

          // Extract title and series URL
          const titleLink = $item.find('.title a');
          const title = titleLink.text().trim();
          const seriesUrl = titleLink.attr('href') || '';

          // Extract thumbnail
          const thumbnailUrl = $item.find('.flexbox3-thumb img').attr('src') || '';

          // Check if adult content
          const isAdult = $item.find('.adult').length > 0;

          // Extract latest chapter info
          const chapterLink = $item.find('.chapter li:first-child a');
          const chapterTitle = chapterLink.text().trim();
          const chapterUrl = chapterLink.attr('href') || '';
          const chapterDate = $item.find('.chapter li:first-child .date').text().trim();

          if (title && seriesUrl) {
            novels.push({
              title,
              seriesUrl,
              thumbnailUrl,
              isAdult,
              latestChapter: {
                title: chapterTitle,
                url: chapterUrl,
                date: chapterDate,
              },
            });
          }
        });

        // Parse pagination info
        const currentPageEl = $('.pagination .current');
        const currentPage = currentPageEl.length > 0 ? parseInt(currentPageEl.text()) : page;

        const lastPageLink = $('.pagination .page-numbers:not(.next):not(.dots)').last();
        const totalPages = lastPageLink.length > 0 ? parseInt(lastPageLink.text()) : currentPage;

        const hasNextPage = $('.pagination .next').length > 0;

        const result: LatestNovelsResponse = {
          novels,
          currentPage,
          totalPages,
          hasNextPage,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching latest novels: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
