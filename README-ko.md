# 복지 혜택 검색

> AI 기반 한국 복지 혜택 검색 서비스

**[welfare.dasong.dev](https://welfare.dasong.dev)** | [English](./README.md)

## 소개

나이, 지역, 상황을 알려주면 받을 수 있는 복지 혜택을 찾아주는 AI 챗봇입니다. 공공 복지 데이터를 조회하는 MCP(Model Context Protocol) 서버를 기반으로 동작합니다.

## 주요 기능

- AI 채팅 기반 복지 혜택 검색
- 한국어, 영어, 일본어, 중국어 다국어 지원
- 스트리밍 응답 및 마크다운 렌더링
- [korea-welfare-mcp-server](https://www.npmjs.com/package/korea-welfare-mcp-server) 연동

## 기술 스택

- **프레임워크**: Next.js (App Router)
- **AI**: OpenAI GPT-4o-mini + AI SDK
- **MCP**: korea-welfare-mcp-server
- **UI**: shadcn/ui + Tailwind CSS

## 시작하기

### 사전 요구사항

- Node.js 18+
- OpenAI API 키
- 공공데이터포털 API 키 ([data.go.kr](https://www.data.go.kr))

### 설치

```bash
git clone https://github.com/SimDaSong/korea-welfare-web.git
cd korea-welfare-web
npm install
```

### 환경변수 설정

```bash
cp .env.example .env.local
```

| 변수 | 필수 여부 | 설명 |
|------|-----------|------|
| `OPENAI_API_KEY` | ✅ | OpenAI API 키 |
| `PUBLIC_DATA_API_KEY` | ✅ | 공공데이터포털 API 키 (일반 인증키, Decoding) |
| `YOUTHCENTER_API_KEY` | 선택 | 온통청년 API 키 |

### 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인하세요.

## 안내

대화 내용은 저장되지 않습니다. AI 답변은 부정확할 수 있으니 반드시 관련 기관에 직접 문의하고, 참고용으로만 활용하세요.

## 라이선스

[CC BY-NC 4.0](./LICENSE) — 비상업적 목적에 한해 자유롭게 사용 및 수정 가능합니다.
