import { streamText, stepCountIs, convertToModelMessages } from 'ai';
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

/** 스트리밍 에러를 사용자 친화적 메시지로 변환 */
function formatStreamError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes('insufficient_quota') || msg.includes('exceeded your current quota')) {
    return '일일 요청 한도를 모두 소진하였습니다. 내일 다시 시도해주세요.';
  }
  if (msg.includes('invalid_api_key') || msg.includes('Incorrect API key')) {
    return '현재 서비스를 이용할 수 없습니다. 잠시 후 다시 시도해주세요.';
  }

  return '서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';
}

export async function POST(req: Request) {
  let mcpClient;

  try {
    const { messages: uiMessages, lang = 'ko' } = await req.json();
    const messages = await convertToModelMessages(uiMessages);

    mcpClient = await createMCPClient({
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

    const tools = await mcpClient.tools();

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: buildSystemPrompt(lang),
      messages,
      tools,
      stopWhen: stepCountIs(5),
      /** 스트리밍 완료 후 MCP 클라이언트 정리 */
      onFinish() {
        mcpClient?.close();
      },
    });

    return result.toUIMessageStreamResponse({
      /** 스트리밍 중 에러 발생 시 사용자에게 보여줄 메시지 반환 */
      onError(error) {
        console.error('[chat] Stream error:', error);
        mcpClient?.close();
        return formatStreamError(error);
      },
    });
  } catch (error) {
    /* MCP 연결 실패, JSON 파싱 실패 등 스트리밍 이전 에러 */
    await mcpClient?.close();
    const message = error instanceof Error ? error.message : String(error);
    console.error('[chat] Error:', message);
    return Response.json(
      { error: formatStreamError(error) },
      { status: 500 },
    );
  }
}
