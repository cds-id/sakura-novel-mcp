# MCP Tools Guide

This document provides a guide to the available tools in this MCP project, including their payloads and responses.

## Tool: `apply-translation-corrections`

**Description:** This tool applies a series of predefined corrections to Indonesian text, primarily for light novel content, to fix common translation errors and improve phrasing.

**Payload:**

```json
{
  "text": "The Indonesian text to be corrected.",
  "aggressive": false,
  "showCorrections": true
}
```

- `text` (string, **required**): The Indonesian text content that needs correction.
- `aggressive` (boolean, optional, default: `false`): If set to `true`, the tool will perform additional, more aggressive corrections, such as fixing spacing around punctuation, collapsing multiple spaces, and ensuring proper capitalization after periods.
- `showCorrections` (boolean, optional, default: `true`): If set to `true`, the response will include a detailed list of all the corrections that were applied to the text.

**Response:**

**Successful Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "The corrected Indonesian text.\n\n---\n\n## Corrections Applied:\n\n- \"Original Phrase\" → \"Corrected Phrase\" (Description of correction)\nTotal corrections: 1"
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): The corrected text. If `showCorrections` was `true` and corrections were made, this string will also contain a summary of the changes.

**Error Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error applying translation corrections: [Error message]"
    }
  ],
  "isError": true
}
```

- `isError` (boolean): This field is present and set to `true` when an error occurs during the correction process.

---

## Tool: `calculate`

**Description:** This tool performs basic arithmetic operations (addition, subtraction, multiplication, and division).

**Payload:**

```json
{
  "operation": "add",
  "a": 5,
  "b": 3
}
```

- `operation` (string, **required**): The arithmetic operation to perform. Must be one of the following values: `"add"`, `"subtract"`, `"multiply"`, `"divide"`.
- `a` (number, **required**): The first operand.
- `b` (number, **required**): The second operand.

**Response:**

**Successful Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Result of add(5, 3) = 8"
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): A string that describes the operation performed and its result.

**Error Response (Division by Zero):**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error: Division by zero is not allowed."
    }
  ],
  "isError": true
}
```

- `isError` (boolean): This field is present and set to `true` when a division by zero is attempted.

---

## Tool: `fetch-chapter-content`

**Description:** This tool fetches the content of a specific chapter from a URL on `sakuranovel.id`.

**Payload:**

```json
{
  "chapterUrl": "https://sakuranovel.id/novel/the-demon-prince-goes-to-the-academy/chapter-1/",
  "includeMetadata": true
}
```

- `chapterUrl` (string, **required**): The full URL of the chapter to be fetched. The URL must be from `sakuranovel.id`.
- `includeMetadata` (boolean, optional, default: `true`): If `true`, the response will include additional metadata about the chapter, such as the title, paragraph count, word count, and character count.

**Response:**

**Successful Response (with metadata):**

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "title": "Chapter Title",
        "content": "The full text content of the chapter...",
        "paragraphs": ["Paragraph 1.", "Paragraph 2."],
        "url": "https://sakuranovel.id/novel/the-demon-prince-goes-to-the-academy/chapter-1/",
        "paragraphCount": 2,
        "wordCount": 100,
        "characterCount": 500,
        "translationNote": "This content is machine-translated..."
      }
    }
  ]
}
```

**Successful Response (without metadata):**

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "content": "The full text content of the chapter...",
        "translationNote": "This content is machine-translated..."
      }
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): A JSON string containing the chapter data.
    - `title` (string): The title of the chapter (only included if `includeMetadata` is `true`).
    - `content` (string): The full text of the chapter, with paragraphs separated by double newlines.
    - `paragraphs` (array of strings): An array where each element is a paragraph of the chapter (only included if `includeMetadata` is `true`).
    - `url` (string): The original URL of the chapter (only included if `includeMetadata` is `true`).
    - `paragraphCount` (number): The number of paragraphs in the chapter (only included if `includeMetadata` is `true`).
    - `wordCount` (number): The total word count of the chapter (only included if `includeMetadata` is `true`).
    - `characterCount` (number): The total character count of the chapter (only included if `includeMetadata` is `true`).
    - `translationNote` (string): A note about the machine-translated nature of the content.

**Error Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error fetching chapter content: [Error message]"
    }
  ],
  "isError": true
}
```

- `isError` (boolean): This field is present and set to `true` when an error occurs, such as an invalid URL or a network issue.

---

## Tool: `fetch-latest-novels`

**Description:** This tool fetches a list of the most recently updated novels from the homepage of `sakuranovel.id`.

**Payload:**

```json
{
  "page": 1,
  "limit": 20
}
```

- `page` (number, optional, default: `1`): The page number of the results to fetch.
- `limit` (number, optional, default: `20`, max: `50`): The maximum number of novels to return in the response.

**Response:**

**Successful Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "novels": [
          {
            "title": "Novel Title",
            "seriesUrl": "https://sakuranovel.id/novel/novel-slug/",
            "thumbnailUrl": "https://sakuranovel.id/wp-content/uploads/2023/10/thumbnail.jpg",
            "isAdult": false,
            "latestChapter": {
              "title": "Chapter 123",
              "url": "https://sakuranovel.id/novel/novel-slug/chapter-123/",
              "date": "July 25, 2025"
            }
          }
        ],
        "currentPage": 1,
        "totalPages": 10,
        "hasNextPage": true
      }
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): A JSON string containing the list of novels and pagination information.
    - `novels` (array of objects): A list of the fetched novels.
      - `title` (string): The title of the novel.
      - `seriesUrl` (string): The URL to the novel's main page.
      - `thumbnailUrl` (string): The URL of the novel's cover image.
      - `isAdult` (boolean): `true` if the novel is marked as adult content.
      - `latestChapter` (object): Information about the most recent chapter.
        - `title` (string): The title of the latest chapter.
        - `url` (string): The URL to the latest chapter.
        - `date` (string): The release date of the latest chapter.
    - `currentPage` (number): The current page number of the results.
    - `totalPages` (number): The total number of pages available.
    - `hasNextPage` (boolean): `true` if there is a next page of results.

**Error Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error fetching latest novels: [Error message]"
    }
  ],
  "isError": true
}
```

- `isError` (boolean): This field is present and set to `true` when an error occurs, such as a network issue.

---

## Tool: `fetch-novel-details`

**Description:** This tool fetches detailed information about a specific novel from its series page on `sakuranovel.id`.

**Payload:**

```json
{
  "seriesUrl": "https://sakuranovel.id/novel/the-demon-prince-goes-to-the-academy/",
  "includeChapters": true,
  "maxChapters": 50
}
```

- `seriesUrl` (string, **required**): The URL of the novel's main series page. The URL must be from `sakuranovel.id`.
- `includeChapters` (boolean, optional, default: `true`): If `true`, the response will include a list of the novel's chapters.
- `maxChapters` (number, optional, default: `50`, max: `1000`): The maximum number of chapters to include in the response. This is only effective if `includeChapters` is `true`.

**Response:**

**Successful Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "title": "The Demon Prince Goes to the Academy",
        "coverImage": "https://sakuranovel.id/wp-content/uploads/2023/10/the-demon-prince-goes-to-the-academy.jpg",
        "type": "Web Novel",
        "status": "Ongoing",
        "rating": {
          "value": 4.8,
          "count": 1234
        },
        "bookmarkCount": 5678,
        "country": "South Korea",
        "publishedYear": "2021",
        "author": "Author Name",
        "totalChapters": "200+",
        "tags": ["Magic", "Academy", "Fantasy"],
        "genres": ["Action", "Adventure", "Comedy"],
        "synopsis": "The synopsis of the novel...",
        "chapters": [
          {
            "title": "Chapter 1",
            "url": "https://sakuranovel.id/novel/the-demon-prince-goes-to-the-academy/chapter-1/",
            "date": "July 25, 2025"
          }
        ],
        "seriesUrl": "https://sakuranovel.id/novel/the-demon-prince-goes-to-the-academy/"
      }
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): A JSON string containing the detailed information about the novel.
    - `title` (string): The title of the novel.
    - `coverImage` (string): The URL of the novel's cover image.
    - `type` (string): The type of the novel (e.g., "Web Novel", "Light Novel").
    - `status` (string): The current status of the novel (e.g., "Ongoing", "Completed").
    - `rating` (object): The novel's rating information.
      - `value` (number): The average rating value.
      - `count` (number): The number of ratings.
    - `bookmarkCount` (number): The number of users who have bookmarked the novel.
    - `country` (string): The country of origin of the novel.
    - `publishedYear` (string): The year the novel was published.
    - `author` (string): The author of the novel.
    - `totalChapters` (string): The total number of chapters.
    - `tags` (array of strings): A list of tags associated with the novel.
    - `genres` (array of strings): A list of genres associated with the novel.
    - `synopsis` (string): The synopsis of the novel.
    - `chapters` (array of objects): A list of the novel's chapters.
      - `title` (string): The title of the chapter.
      - `url` (string): The URL of the chapter.
      - `date` (string): The release date of the chapter.
    - `seriesUrl` (string): The original URL of the novel's series page.

**Error Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error fetching novel details: [Error message]"
    }
  ],
  "isError": true
}
```

- `isError` (boolean): This field is present and set to `true` when an error occurs, such as an invalid URL or a network issue.

---

## Tool: `search-novels`

**Description:** This tool performs an advanced search for novels on `sakuranovel.id` using various filters.

**Payload:**

```json
{
  "title": "Demon Prince",
  "author": "Author Name",
  "year": 2021,
  "status": "ongoing",
  "type": "Web Novel",
  "orderBy": "rating",
  "countries": ["korea"],
  "genres": ["action", "fantasy"],
  "page": 1
}
```

- `title` (string, optional): The title of the novel to search for.
- `author` (string, optional): The name of the author to search for.
- `year` (number, optional): The publication year of the novel.
- `status` (string, optional, default: `"all"`): The status of the novel. Can be `"all"`, `"ongoing"`, or `"completed"`.
- `type` (string, optional, default: `"all"`): The type of the novel. Can be `"all"`, `"Web Novel"`, or `"Light Novel"`.
- `orderBy` (string, optional, default: `"title"`): The order in which to sort the results. Can be `"title"`, `"titlereverse"`, `"update"`, `"latest"`, `"popular"`, or `"rating"`.
- `countries` (array of strings, optional): A list of countries of origin to filter by. Can include `"china"`, `"jepang"`, `"korea"`, and `"unknown"`.
- `genres` (array of strings, optional): A list of genres to filter by.
- `page` (number, optional, default: `1`): The page number of the results to fetch.

**Response:**

**Successful Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": {
        "results": [
          {
            "title": "The Demon Prince Goes to the Academy",
            "seriesUrl": "https://sakuranovel.id/novel/the-demon-prince-goes-to-the-academy/",
            "thumbnailUrl": "https://sakuranovel.id/wp-content/uploads/2023/10/the-demon-prince-goes-to-the-academy.jpg",
            "type": "Web Novel",
            "status": "Ongoing",
            "country": "South Korea",
            "rating": {
              "value": 4.8
            },
            "synopsis": "The synopsis of the novel...",
            "genres": ["Action", "Fantasy"],
            "isAdult": false
          }
        ],
        "currentPage": 1,
        "totalPages": 1,
        "hasNextPage": false,
        "searchParams": {
          "title": "Demon Prince",
          "author": "Author Name",
          "year": 2021,
          "status": "ongoing",
          "type": "Web Novel",
          "orderBy": "rating",
          "countries": ["korea"],
          "genres": ["action", "fantasy"]
        },
        "translationNote": "Synopsis and other text content is machine-translated..."
      }
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): A JSON string containing the search results and pagination information.
    - `results` (array of objects): A list of the novels that match the search criteria.
      - `title` (string): The title of the novel.
      - `seriesUrl` (string): The URL to the novel's main page.
      - `thumbnailUrl` (string): The URL of the novel's cover image.
      - `type` (string): The type of the novel.
      - `status` (string, optional): The status of the novel.
      - `country` (string, optional): The country of origin of the novel.
      - `rating` (object, optional): The novel's rating information.
        - `value` (number): The average rating value.
      - `synopsis` (string): The synopsis of the novel.
      - `genres` (array of strings): A list of genres associated with the novel.
      - `isAdult` (boolean): `true` if the novel is marked as adult content.
    - `currentPage` (number): The current page number of the results.
    - `totalPages` (number): The total number of pages available for the search query.
    - `hasNextPage` (boolean): `true` if there is a next page of results.
    - `searchParams` (object): An object containing the search parameters that were used for the query.
    - `translationNote` (string, optional): A note about the machine-translated nature of the content, which appears if there are results.

**Error Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Error searching novels: [Error message]"
    }
  ],
  "isError": true
}
```

- `isError` (boolean): This field is present and set to `true` when an error occurs, such as a network issue.

---

## Tool: `timestamp`

**Description:** This tool provides the current timestamp in various formats.

**Payload:**

```json
{
  "format": "iso"
}
```

- `format` (string, optional, default: `"iso"`): The desired format for the timestamp. Can be one of the following values:
  - `"iso"`: Returns the timestamp in ISO 8601 format (e.g., `"2025-07-26T10:00:00.000Z"`).
  - `"unix"`: Returns the timestamp as a Unix epoch time (seconds since January 1, 1970).
  - `"readable"`: Returns the timestamp in a human-readable format based on the server's locale.

**Response:**

**Successful Response:**

```json
{
  "content": [
    {
      "type": "text",
      "text": "Current timestamp (iso): 2025-07-26T10:00:00.000Z"
    }
  ]
}
```

- `content` (array): An array containing a single text object.
  - `type` (string): Always has the value `"text"`.
  - `text` (string): A string that indicates the format of the timestamp and the timestamp itself.

```

```
