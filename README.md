# Korea Welfare Search

> AI-powered welfare benefits search service for Korea

**[welfare.dasong.dev](https://welfare.dasong.dev)** | [한국어](./README-ko.md)

## Overview

An AI chatbot that helps users find Korean government welfare benefits based on their age, region, and situation. Powered by an MCP (Model Context Protocol) server that queries public welfare data.

## Features

- AI-powered welfare benefits search via chat
- Multilingual support: Korean, English, Japanese, Chinese
- Streaming responses with markdown rendering
- Powered by [korea-welfare-mcp-server](https://www.npmjs.com/package/korea-welfare-mcp-server)

## Tech Stack

- **Framework**: Next.js (App Router)
- **AI**: OpenAI GPT-4o-mini + AI SDK
- **MCP**: korea-welfare-mcp-server
- **UI**: shadcn/ui + Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key
- 공공데이터포털 API key ([data.go.kr](https://www.data.go.kr))

### Installation

```bash
git clone https://github.com/SimDaSong/korea-welfare-web.git
cd korea-welfare-web
npm install
```

### Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | ✅ | OpenAI API key |
| `PUBLIC_DATA_API_KEY` | ✅ | 공공데이터포털 API key (Decoding) |
| `YOUTHCENTER_API_KEY` | Optional | 온통청년 API key |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Disclaimer

Conversations are not stored. AI responses may be inaccurate — always contact the relevant authority directly and use this for reference only.

## License

MIT
