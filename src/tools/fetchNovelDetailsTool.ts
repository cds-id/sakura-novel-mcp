import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';

import type { NovelChapter, NovelDetails } from '../types/novel.types.js';
import { httpConfig } from '../config/httpConfig.js';

/**
 * Extract novel details from the series page
 */
function extractNovelDetails($: CheerioAPI, url: string): NovelDetails {
  // Extract title
  const title = $('.series-title h2').first().text().trim();

  // Extract cover image
  const coverImage = $('.series-thumb img').attr('src') || '';

  // Extract type and status
  const type = $('.series-infoz.block .type').text().trim();
  const status = $('.series-infoz.block .status').text().trim();

  // Extract rating
  const ratingValue = parseFloat($('.series-infoz.score span[itemprop="ratingValue"]').text()) || 0;
  const ratingCount = parseInt($('.series-infoz.score span[itemprop="ratingCount"]').text()) || 0;

  // Extract bookmark count
  const bookmarkText = $('.favcount span[data-favorites-post-count-id]').text().trim();
  const bookmarkCount = parseInt(bookmarkText) || 0;

  // Extract metadata
  const infoItems = $('.series-infolist li');
  let country = '';
  let publishedYear = '';
  let author = '';
  let totalChapters = '';

  infoItems.each((_, element) => {
    const $item = $(element);
    const label = $item.find('b').text().trim();
    const value = $item.find('span').text().trim();

    switch (label) {
      case 'Country':
        country = value;
        break;
      case 'Published':
        publishedYear = value;
        break;
      case 'Author':
        author = value;
        break;
      case 'Total Chapter':
        totalChapters = value;
        break;
    }
  });

  // Extract tags
  const tags: string[] = [];
  $('.series-infolist li').each((_, element) => {
    const $item = $(element);
    if ($item.find('b').text().trim() === 'Tags') {
      $item.find('a').each((_, tagEl) => {
        const tag = $(tagEl).text().trim();
        if (tag) tags.push(tag);
      });
    }
  });

  // Extract genres
  const genres: string[] = [];
  $('.series-genres a').each((_, element) => {
    const genre = $(element).text().trim();
    if (genre) genres.push(genre);
  });

  // Extract synopsis
  const synopsis = $('.series-synops p')
    .map((_, el) => $(el).text().trim())
    .get()
    .join('\n\n');

  // Extract chapters
  const chapters: NovelChapter[] = [];
  $('.series-chapterlists li').each((_, element) => {
    const $item = $(element);
    const $link = $item.find('.flexch-infoz a');
    const title = $link.find('span').first().text().trim();
    const chapterUrl = $link.attr('href') || '';
    const date = $link.find('span.date').text().trim();

    if (title && chapterUrl) {
      chapters.push({
        title,
        url: chapterUrl,
        date,
      });
    }
  });

  return {
    title,
    coverImage,
    type,
    status,
    rating: {
      value: ratingValue,
      count: ratingCount,
    },
    bookmarkCount,
    country,
    publishedYear,
    author,
    totalChapters,
    tags,
    genres,
    synopsis,
    chapters,
    seriesUrl: url,
  };
}

/**
 * A tool that fetches detailed information about a specific novel from sakuranovel.id
 * @param server The MCP server instance
 */
export function fetchNovelDetailsTool(server: McpServer): void {
  server.tool(
    'fetch-novel-details',
    {
      seriesUrl: z.string().url().describe('The URL of the novel series page on sakuranovel.id'),
      includeChapters: z
        .boolean()
        .optional()
        .default(true)
        .describe('Whether to include the chapter list'),
      maxChapters: z
        .number()
        .min(1)
        .max(1000)
        .optional()
        .default(50)
        .describe('Maximum number of chapters to include'),
    },
    async ({ seriesUrl, includeChapters, maxChapters }) => {
      try {
        // Validate URL is from sakuranovel.id
        const url = new URL(seriesUrl);
        if (!url.hostname.includes('sakuranovel.id')) {
          throw new Error('URL must be from sakuranovel.id');
        }

        const response = await fetch(seriesUrl, {
          headers: httpConfig.getHeaders(),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract novel details
        const novelDetails = extractNovelDetails($, seriesUrl);

        // Limit chapters if requested
        if (!includeChapters) {
          novelDetails.chapters = [];
        } else if (novelDetails.chapters.length > maxChapters) {
          novelDetails.chapters = novelDetails.chapters.slice(0, maxChapters);
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(novelDetails, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching novel details: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
