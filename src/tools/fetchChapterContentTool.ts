import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { httpConfig } from '../config/httpConfig.js';
import type { ChapterContent } from '../types/novel.types.js';

/**
 * Extract chapter content from the page
 */
function extractChapterContent($: CheerioAPI, url: string, debug: boolean = false): ChapterContent {
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

  // Extract paragraphs - try multiple selectors
  const paragraphs: string[] = [];
  const debugInfo: string[] = [];

  // First try: Look for entry-content inside tldariinggrissendiribrojangancopy
  const selector1 = '.tldariinggrissendiribrojangancopy .entry-content p';
  const count1 = $(selector1).length;
  if (debug) debugInfo.push(`Selector '${selector1}' found ${count1} elements`);

  $(selector1).each((_, element) => {
    const text = $(element).text().trim();
    // Skip the "Baca novel lain di sakuranovel" footer text
    if (text && !text.includes('Baca novel lain di sakuranovel')) {
      paragraphs.push(text);
    }
  });

  // Second try: Direct selector for ds-markdown-paragraph
  if (paragraphs.length === 0) {
    const selector2 = '#content p.ds-markdown-paragraph';
    const count2 = $(selector2).length;
    if (debug) debugInfo.push(`Selector '${selector2}' found ${count2} elements`);

    $(selector2).each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });
  }

  // Third try: Look inside tldariinggrissendiribrojangancopy with any p tags
  if (paragraphs.length === 0) {
    const selector3 = '.tldariinggrissendiribrojangancopy p';
    const count3 = $(selector3).length;
    if (debug) debugInfo.push(`Selector '${selector3}' found ${count3} elements`);

    $(selector3).each((_, element) => {
      const text = $(element).text().trim();
      // Skip the "Baca novel lain di sakuranovel" footer text
      if (text && !text.includes('Baca novel lain di sakuranovel')) {
        paragraphs.push(text);
      }
    });
  }

  // Fourth try: Any p tag with ds-markdown-paragraph class
  if (paragraphs.length === 0) {
    const selector4 = 'p.ds-markdown-paragraph';
    const count4 = $(selector4).length;
    if (debug) debugInfo.push(`Selector '${selector4}' found ${count4} elements`);

    $(selector4).each((_, element) => {
      const text = $(element).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });
  }

  // Last resort: regular p tags inside content
  if (paragraphs.length === 0) {
    const selector5 = '#content p';
    const count5 = $(selector5).length;
    if (debug) debugInfo.push(`Selector '${selector5}' found ${count5} elements`);

    $(selector5).each((_, element) => {
      const text = $(element).text().trim();
      // Avoid picking up non-content paragraphs
      if (text && !text.includes('Baca novel lain di sakuranovel')) {
        paragraphs.push(text);
      }
    });
  }

  // Join paragraphs with double newlines for full content
  const content = paragraphs.join('\n\n');

  // Add debug info if enabled
  const result: ChapterContent & { debugInfo?: string[] } = {
    title,
    content,
    paragraphs,
    url,
  };

  if (debug) {
    result.debugInfo = debugInfo;
  }

  return result;
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
      debug: z
        .boolean()
        .optional()
        .default(false)
        .describe('Enable debug mode to show selector information'),
    },
    async ({ chapterUrl, includeMetadata, debug }) => {
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
        const chapterContent = extractChapterContent($, chapterUrl, debug);

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
            ...(debug && (chapterContent as any).debugInfo
              ? { debugInfo: (chapterContent as any).debugInfo }
              : {}),
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
