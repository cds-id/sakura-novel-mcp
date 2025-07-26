export interface NovelChapter {
  title: string;
  url: string;
  date: string;
}

export interface Novel {
  title: string;
  seriesUrl: string;
  thumbnailUrl: string;
  latestChapter: NovelChapter;
  isAdult?: boolean;
}

export interface LatestNovelsResponse {
  novels: Novel[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface FetchLatestNovelsParams {
  page?: number;
}

export interface NovelDetails {
  title: string;
  coverImage: string;
  type: string;
  status: string;
  rating: {
    value: number;
    count: number;
  };
  bookmarkCount: number;
  country: string;
  publishedYear: string;
  author: string;
  totalChapters: string;
  tags: string[];
  genres: string[];
  synopsis: string;
  chapters: NovelChapter[];
  seriesUrl: string;
}

export interface ChapterContent {
  title: string;
  content: string;
  paragraphs: string[];
  url: string;
}

export interface SearchResult {
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

export interface SearchResponse {
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
  translationNote?: string;
}
