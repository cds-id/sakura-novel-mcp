import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { httpConfig } from '../config/httpConfig.js';
import type { ChapterContent } from '../types/novel.types.js';

/**
 * Extract chapter content from the page
 */
function extractChapterContent($: CheerioAPI, url: string): ChapterContent {
  // Extract title from various possible locations
  let title = '';

  // Try to get title from h1 or h2 in the content area
  const contentTitle = $('#content h1, #content h2').first().text().trim();
  if (contentTitle) {
    title = contentTitle;
  } else {
    // Try to get from page title
    const pageTitle = $('title').text().trim();
    if (pageTitle) {
      // Remove site name from title if present
      title = pageTitle.replace(/\s*[-–]\s*Sakura Novel.*$/i, '').trim();
    }
  }

  // Extract paragraphs
  const paragraphs: string[] = [];
  $('#content p.ds-markdown-paragraph').each((_, element) => {
    const text = $(element).text().trim();
    if (text) {
      paragraphs.push(text);
    }
  });

  // If no paragraphs with ds-markdown-paragraph class, try regular p tags
  if (paragraphs.length === 0) {
    $('#content p').each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });
  }

  // Join paragraphs with double newlines for full content
  const content = paragraphs.join('\n\n');

  return {
    title,
    content,
    paragraphs,
    url,
  };
}

/**
 * A tool that fetches the content of a specific chapter from sakuranovel.id
 * @param server The MCP server instance
 */
export function fetchChapterContentTool(server: McpServer): void {
  server.tool(
    'fetch-chapter-content',
    {
      chapterUrl: z.string().url().describe('The URL of the chapter page on sakuranovel.id'),
      includeMetadata: z
        .boolean()
        .optional()
        .default(true)
        .describe('Whether to include metadata like title and paragraph count'),
    },
    async ({ chapterUrl, includeMetadata }) => {
      try {
        // Validate URL is from sakuranovel.id
        const url = new URL(chapterUrl);
        if (!url.hostname.includes('sakuranovel.id')) {
          throw new Error('URL must be from sakuranovel.id');
        }

        const response = await fetch(chapterUrl, {
          headers: httpConfig.getHeaders(chapterUrl),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract chapter content
        const chapterContent = extractChapterContent($, chapterUrl);

        // Prepare response based on includeMetadata flag
        let resultData: any = {
          content: chapterContent.content,
          translationNote:
            'This content is machine-translated from English/Chinese/Japanese to Indonesian. Common issues include: "Beastskin" translated as "Kulit Binatang" instead of "Ras Binatang", literal translations of fantasy terms, and awkward sentence structures. Use the "correct-translation" prompt for guidance on fixing these issues.',
        };

        if (includeMetadata) {
          resultData = {
            ...chapterContent,
            paragraphCount: chapterContent.paragraphs.length,
            wordCount: chapterContent.content.split(/\s+/).filter(word => word.length > 0).length,
            characterCount: chapterContent.content.length,
            translationNote:
              'This content is machine-translated from English/Chinese/Japanese to Indonesian. Common issues include: "Beastskin" translated as "Kulit Binatang" instead of "Ras Binatang", literal translations of fantasy terms, and awkward sentence structures. Use the "correct-translation" prompt for guidance on fixing these issues.',
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(resultData, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching chapter content: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
