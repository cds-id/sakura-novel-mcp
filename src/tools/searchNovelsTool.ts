import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import * as cheerio from 'cheerio';
import type { CheerioAPI } from 'cheerio';
import { httpConfig } from '../config/httpConfig.js';

// Available genres on sakuranovel.id
const AVAILABLE_GENRES = [
  'action',
  'adult',
  'adventure',
  'comedy',
  'drama',
  'ecchi',
  'fantasy',
  'gender-bender',
  'harem',
  'horror',
  'josei',
  'martial-arts',
  'mature',
  'mecha',
  'mystery',
  'psychological',
  'romance',
  'school-life',
  'sci-fi',
  'seinen',
  'shoujo',
  'shounen',
  'slice-of-life',
  'smut',
  'supernatural',
  'tragedy',
  'wuxia',
  'xianxia',
  'xuanhuan',
] as const;

// Search result interface
interface SearchResult {
  title: string;
  seriesUrl: string;
  thumbnailUrl: string;
  type: string;
  status?: string;
  country?: string;
  rating?: {
    value: number;
    count?: number;
  };
  bookmarked?: number;
  synopsis: string;
  genres: string[];
  isAdult: boolean;
}

interface SearchResponse {
  results: SearchResult[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  totalResults?: number;
  searchParams: {
    title?: string;
    author?: string;
    year?: number;
    status?: string;
    type?: string;
    orderBy?: string;
    countries?: string[];
    genres?: string[];
  };
}

/**
 * Build query string from search parameters
 */
function buildQueryString(params: any): string {
  const queryParams = new URLSearchParams();

  // Always include all parameters, even if empty
  queryParams.append('title', params.title || '');
  queryParams.append('author', params.author || '');
  queryParams.append('yearx', params.yearx ? params.yearx.toString() : '');
  queryParams.append('status', params.status === 'all' ? '' : params.status || '');
  queryParams.append('type', params.type === 'all' ? '' : params.type || '');
  queryParams.append('order', params.orderBy || '');

  // Array parameters - need special handling with indices
  if (params.countries && params.countries.length > 0) {
    params.countries.forEach((country: string, index: number) => {
      queryParams.append(`country[${index}]`, country);
    });
  }

  if (params.genres && params.genres.length > 0) {
    params.genres.forEach((genre: string, index: number) => {
      queryParams.append(`genre[${index}]`, genre);
    });
  }

  return queryParams.toString();
}

/**
 * Parse search results from the page
 */
function parseSearchResults($: CheerioAPI, url: string): SearchResponse {
  const results: SearchResult[] = [];

  // Parse each novel item
  $('.flexbox2-item').each((_, element) => {
    const $item = $(element);

    // Extract basic info
    const $titleLink = $item.find('.flexbox2-content > a').first();
    const title =
      $item.find('.flexbox2-title > span:first-child').text().trim() ||
      $titleLink.attr('title') ||
      '';
    const seriesUrl = $titleLink.attr('href') || '';

    // Extract thumbnail
    const thumbnailUrl = $item.find('.flexbox2-thumb img').attr('src') || '';

    // Extract type (Web Novel/Light Novel)
    const type = $item.find('.flexbox2-side .type').text().trim();

    // Extract country/studio
    const country = $item.find('.flexbox2-title .studio').text().trim();

    // Check if adult content
    const isAdult = $item.find('.flexbox2-thumb .adult').length > 0;

    // Extract rating
    const ratingValue = parseFloat($item.find('.score').text().trim()) || 0;

    // Extract synopsis
    const synopsis = $item.find('.synops p').text().trim();

    // Extract genres
    const genres: string[] = [];
    $item.find('.genres a').each((_, genreEl) => {
      const genre = $(genreEl).text().trim();
      if (genre) genres.push(genre);
    });

    if (title && seriesUrl) {
      results.push({
        title,
        seriesUrl,
        thumbnailUrl,
        type,
        country,
        rating: {
          value: ratingValue,
        },
        synopsis,
        genres,
        isAdult,
      });
    }
  });

  // Parse pagination info
  const currentPageEl = $('.pagination .current');
  const currentPage = currentPageEl.length > 0 ? parseInt(currentPageEl.text()) : 1;

  const lastPageLink = $('.pagination .page-numbers:not(.next):not(.dots)').last();
  const totalPages = lastPageLink.length > 0 ? parseInt(lastPageLink.text()) : currentPage;

  const hasNextPage = $('.pagination .next').length > 0;

  // Extract search parameters from URL
  const urlObj = new URL(url);

  // Extract indexed array parameters
  const countries: string[] = [];
  const genres: string[] = [];

  // Iterate through all parameters to find indexed arrays
  urlObj.searchParams.forEach((value, key) => {
    if (key.startsWith('country[') && key.endsWith(']')) {
      countries.push(value);
    } else if (key.startsWith('genre[') && key.endsWith(']')) {
      genres.push(value);
    }
  });

  const searchParams = {
    title: urlObj.searchParams.get('title') || undefined,
    author: urlObj.searchParams.get('author') || undefined,
    year: urlObj.searchParams.get('yearx')
      ? parseInt(urlObj.searchParams.get('yearx')!)
      : undefined,
    status: urlObj.searchParams.get('status') || undefined,
    type: urlObj.searchParams.get('type') || undefined,
    orderBy: urlObj.searchParams.get('order') || undefined,
    countries,
    genres,
  };

  return {
    results,
    currentPage,
    totalPages,
    hasNextPage,
    searchParams,
  };
}

/**
 * A tool that searches for novels on sakuranovel.id with advanced filters
 * @param server The MCP server instance
 */
export function searchNovelsTool(server: McpServer): void {
  server.tool(
    'search-novels',
    {
      title: z.string().optional().describe('Novel title to search for'),
      author: z.string().optional().describe('Author name to search for'),
      year: z.number().min(1900).max(2100).optional().describe('Publication year'),
      status: z
        .enum(['all', 'ongoing', 'completed'])
        .optional()
        .default('all')
        .describe('Novel status'),
      type: z
        .enum(['all', 'Web Novel', 'Light Novel'])
        .optional()
        .default('all')
        .describe('Novel type'),
      orderBy: z
        .enum(['title', 'titlereverse', 'update', 'latest', 'popular', 'rating'])
        .optional()
        .default('title')
        .describe('Sort order'),
      countries: z
        .array(z.enum(['china', 'jepang', 'korea', 'unknown']))
        .optional()
        .describe('Countries of origin'),
      genres: z.array(z.enum(AVAILABLE_GENRES)).optional().describe('Genres to filter by'),
      page: z.number().min(1).optional().default(1).describe('Page number for pagination'),
    },
    async ({ title, author, year, status, type, orderBy, countries, genres, page }) => {
      try {
        // Build search parameters - ensure all parameters exist
        const searchParams: any = {
          title: title || '',
          author: author || '',
          yearx: year || '',
          status: status || 'all',
          type: type || 'all',
          orderBy: orderBy || 'title',
          countries: countries?.length ? countries : ['china', 'jepang', 'korea'],
          genres: genres || [],
        };

        // Build URL
        const baseUrl = 'https://sakuranovel.id/advanced-search';
        const queryString = buildQueryString(searchParams);
        const url =
          page > 1 ? `${baseUrl}/page/${page}/?${queryString}` : `${baseUrl}/?${queryString}`;

        // Fetch the page
        const response = await fetch(url, {
          headers: httpConfig.getHeaders(url),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Parse search results
        const searchResponse = parseSearchResults($, url);

        // Add translation note if results contain content
        const responseData = {
          ...searchResponse,
          translationNote:
            searchResponse.results.length > 0
              ? 'Synopsis and other text content is machine-translated. Use the "correct-translation" prompt or "apply-translation-corrections" tool for better translations.'
              : undefined,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(responseData, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return {
          content: [
            {
              type: 'text',
              text: `Error searching novels: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
