# Sakura Novel MCP Server

[![MCP TypeScript SDK NPM Version](https://img.shields.io/npm/v/@modelcontextprotocol/sdk)](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A Model Context Protocol (MCP) server for fetching and processing Indonesian light novel content from sakuranovel.id, with built-in machine translation correction capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
  - [HTTP Server](#http-server)
  - [Stdio Mode](#stdio-mode)
- [Available Tools](#available-tools)
- [Available Resources](#available-resources)
- [Available Prompts](#available-prompts)
- [Translation Correction System](#translation-correction-system)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This MCP server provides tools and resources for interacting with sakuranovel.id, an Indonesian light novel website. Since the content on sakuranovel.id is machine-translated from various languages (English, Chinese, Japanese) to Indonesian, this server includes a comprehensive translation correction system to fix common machine translation errors.

## Features

- 📚 **Novel Content Fetching**: Retrieve latest novels, novel details, and chapter content
- 🔧 **Translation Correction**: Automatically detect and correct common machine translation errors
- 📖 **Translation Guide**: Comprehensive resource for understanding translation patterns
- 🛠️ **Multiple Transport Options**: Supports both HTTP and stdio communication
- 📝 **TypeScript Support**: Full type safety and better developer experience
- ✅ **Comprehensive Tests**: Jest test suite for all tools

## Project Structure

```
sakura-novel-mcp/
├── .env                           # Environment variables
├── .env.example                   # Example environment variables
├── .gitignore                     # Git ignore file
├── package.json                   # Project dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── jest.config.js                 # Jest testing configuration
├── src/
│   ├── index.ts                   # Main HTTP server entry point
│   ├── stdio.ts                   # Stdio server entry point
│   ├── config/
│   │   └── httpConfig.ts          # HTTP headers configuration for sakuranovel.id
│   ├── types/
│   │   └── novel.types.ts         # TypeScript type definitions
│   ├── resources/                 # MCP resources
│   │   ├── index.ts               # Resource registration
│   │   ├── infoResource.ts        # Server information resource
│   │   ├── greetingResource.ts    # Dynamic greeting resource
│   │   └── translationGuideResource.ts # Translation correction guide
│   ├── tools/                     # MCP tools
│   │   ├── index.ts               # Tool registration
│   │   ├── fetchLatestNovelTool.ts # Fetch latest novels
│   │   ├── fetchNovelDetailsTool.ts # Fetch novel details
│   │   ├── fetchChapterContentTool.ts # Fetch chapter content
│   │   ├── applyTranslationCorrectionsTool.ts # Apply translation fixes
│   │   ├── calculatorTool.ts      # Sample calculator tool
│   │   └── timestampTool.ts       # Sample timestamp tool
│   ├── prompts/                   # MCP prompts
│   │   ├── index.ts               # Prompt registration
│   │   ├── greetingPrompt.ts      # Sample greeting prompt
│   │   ├── analyzeDataPrompt.ts   # Sample data analysis prompt
│   │   └── correctTranslationPrompt.ts # Translation correction guidance
│   └── __tests__/                 # Test files
│       └── tools/                 # Tool tests
└── dist/                          # Compiled JavaScript output
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/sakura-novel-mcp.git
cd sakura-novel-mcp
npm install
```

### Environment Variables

Copy the example environment file and modify as needed:

```bash
cp .env.example .env
```

Available environment variables:

- `PORT`: The port for the HTTP server (default: 3000)
- `NODE_ENV`: Environment mode (development, production)

## Running the Server

### HTTP Server

Build and start the HTTP server:

```bash
npm run build
npm start
```

For development with auto-restart:

```bash
npm run dev
```

The server will be available at:

- Main endpoint: `http://localhost:3000/mcp`
- SSE endpoint: `http://localhost:3000/sse/connect`
- Health check: `http://localhost:3000/health`

### Stdio Mode

To run the server in stdio mode (for command-line tools):

```bash
npm run start:stdio
```

For development with auto-restart:

```bash
npm run dev:stdio
```

## Available Tools

### 1. **fetch-latest-novels**

Fetches the latest novel updates from sakuranovel.id.

Parameters:

- `page` (number, optional): Page number to fetch (default: 1)
- `limit` (number, optional): Maximum number of novels to return (1-50, default: 20)

Returns: List of novels with their latest chapters, thumbnails, and metadata.

### 2. **fetch-novel-details**

Fetches detailed information about a specific novel.

Parameters:

- `seriesUrl` (string): The URL of the novel series page
- `includeChapters` (boolean, optional): Whether to include chapter list (default: true)
- `maxChapters` (number, optional): Maximum chapters to include (1-1000, default: 50)

Returns: Novel details including title, author, genres, tags, synopsis, and chapters.

### 3. **fetch-chapter-content**

Fetches and parses the content of a specific chapter.

Parameters:

- `chapterUrl` (string): The URL of the chapter page
- `includeMetadata` (boolean, optional): Include metadata like word count (default: true)

Returns: Chapter content with optional metadata and translation quality note.

### 4. **apply-translation-corrections**

Applies automatic translation corrections to Indonesian text.

Parameters:

- `text` (string): The Indonesian text to correct
- `aggressive` (boolean, optional): Apply aggressive corrections including formatting (default: false)
- `showCorrections` (boolean, optional): Show list of corrections made (default: true)

Returns: Corrected text with optional correction details.

### 5. **calculate** (Sample Tool)

Performs basic arithmetic operations.

Parameters:

- `operation`: Operation type (add, subtract, multiply, divide)
- `a`: First number
- `b`: Second number

### 6. **timestamp** (Sample Tool)

Provides current timestamp in various formats.

Parameters:

- `format`: Output format (iso, unix, readable)

## Available Resources

### 1. **info://server**

Provides basic information about the server, including version and capabilities.

### 2. **greeting://{name}**

Dynamic resource that generates personalized greetings.

### 3. **guide://translation/corrections**

Comprehensive translation correction guide with detailed tables of common errors and their fixes.

## Available Prompts

### 1. **greeting**

A simple greeting prompt for introductions.

### 2. **analyze-data**

A prompt template for data analysis tasks.

### 3. **correct-translation**

Detailed guidance for AI to correct machine translation errors in Indonesian light novel content.

## Translation Correction System

The server includes a sophisticated system for handling machine translation errors commonly found in Indonesian light novel content:

### Common Corrections

1. **Race/Species Terms**

   - "Kulit Binatang" → "Ras Binatang" (Beastskin)
   - "Kulit Naga" → "Ras Naga" (Dragonkin)
   - "Peri" → "Elf" (when referring to the race)

2. **Gaming/RPG Terms**

   - Preserves English terms like "Skill", "Level", "Guild", "Dungeon"
   - Corrects overly literal translations

3. **Cultivation/Xianxia Terms**

   - "Pertanian" → "Kultivasi" (Cultivation)
   - "Batu Semangat" → "Batu Roh" (Spirit Stone)

4. **Natural Indonesian Phrasing**
   - "Apakah kamu memiliki" → "Kamu punya"
   - "Aku akan pergi ke sana" → "Aku mau ke sana"

### Using the Translation System

1. **Automatic Correction**: Use the `apply-translation-corrections` tool
2. **AI Guidance**: Use the `correct-translation` prompt for AI-assisted correction
3. **Reference Guide**: Access `guide://translation/corrections` for comprehensive guidelines

## Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Features

When adding new translation rules:

1. Add the pattern to `src/tools/applyTranslationCorrectionsTool.ts`
2. Update the translation guide resource
3. Add corresponding tests
4. Update documentation

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with the [Model Context Protocol SDK](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- Content sourced from [sakuranovel.id](https://sakuranovel.id)
