import { streamText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { LANGUAGE_INSTRUCTIONS, type Language } from '@/lib/i18n';

const BASE_SYSTEM_PROMPT = `당신은 한국 복지 혜택 검색을 도와주는 AI 어시스턴트입니다.
사용자의 질문을 분석하여 적절한 도구를 사용해 복지 정보를 검색하고,
결과를 이해하기 쉽게 요약해서 알려주세요.

규칙:
- 검색 결과에서 핵심 정보(서비스명, 대상, 지원내용, 신청방법)를 정리
- 사용자의 상황에 맞는 추천 제공
- 불확실한 정보는 공식 사이트 확인을 안내`;

function buildSystemPrompt(lang: Language): string {
  return `${BASE_SYSTEM_PROMPT}\n- ${LANGUAGE_INSTRUCTIONS[lang]}`;
}

export async function POST(req: Request) {
  const { messages, lang = 'ko' } = await req.json();

  const mcpClient = await createMCPClient({
    transport: new Experimental_StdioMCPTransport({
      command: 'node',
      args: [
        'node_modules/korea-welfare-mcp-server/dist/index.js',
      ],
      env: {
        ...process.env as Record<string, string>,
        PUBLIC_DATA_API_KEY: process.env.PUBLIC_DATA_API_KEY!,
        YOUTHCENTER_API_KEY: process.env.YOUTHCENTER_API_KEY ?? '',
      },
    }),
  });

  try {
    const tools = await mcpClient.tools();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: buildSystemPrompt(lang),
      messages,
      tools,
      stopWhen: stepCountIs(5),
    });

    return result.toTextStreamResponse();
  } finally {
    await mcpClient.close();
  }
}
