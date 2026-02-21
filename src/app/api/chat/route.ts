import { streamText, stepCountIs, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { LANGUAGE_INSTRUCTIONS, type Language } from '@/lib/i18n';

const BASE_SYSTEM_PROMPT = `당신은 한국 복지 혜택 검색을 도와주는 AI 어시스턴트입니다.
사용자의 질문을 분석하여 적절한 도구를 사용해 복지 정보를 검색하고,
결과를 이해하기 쉽게 요약해서 알려주세요.

## 도구별 용도와 호출 예시

### welfare_search_benefits (복지로 키워드 검색)
- 용도: 한국어 키워드로 복지 혜택 검색. 짧고 핵심적인 키워드가 효과적.
- 좋은 예: query="주거", query="출산", query="청년", query="실업"
- 나쁜 예: query="청년 주거 지원" (너무 길면 결과 없음)

### welfare_search_by_lifecycle (생애주기별 검색)
- 용도: 주거, 출산, 육아, 취업, 결혼, 교육, 노후 관련 질문에 사용
- lifecycle 값: birth, child_care, education, employment, marriage, housing, retirement
- 예: "주거 지원" → lifecycle="housing", "출산 지원금" → lifecycle="birth"

### welfare_check_eligibility (자격 요건 확인)
- 용도: 나이, 지역, 소득 등 사용자 조건이 있을 때
- 사용자가 명시하지 않은 파라미터는 반드시 생략 (추측하여 채우지 말 것)
- life_event: 한국어만 사용 (결혼, 출산, 취업, 주거 등). 해당 없으면 생략

### welfare_search_youth_policies (청년 정책 검색)
- 용도: 15~34세 청년 대상 정책 검색
- keyword: 짧은 한국어 키워드 (예: "주거", "취업", "창업")
- category: employment, education, welfare, housing, culture

### welfare_get_detail (상세 조회)
- 용도: 검색 결과에서 특정 서비스의 상세 정보 조회

## 도구 조합 전략
- 하나의 질문에 2~3개 도구를 동시에 호출하여 풍부한 결과 제공
- 예: "청년 주거 지원" → welfare_search_by_lifecycle(housing) + welfare_search_youth_policies(keyword="주거", category="housing") + welfare_search_benefits(query="주거")
- 예: "서울 30대 혜택" → welfare_check_eligibility(age=30, region="서울") + welfare_search_benefits(query="청년")
- 예: "출산 지원금" → welfare_search_by_lifecycle(birth) + welfare_search_benefits(query="출산")
- 결과가 없으면 다른 도구나 더 짧은 키워드로 재시도

## 파라미터 규칙
- 선택 파라미터는 사용자가 명시한 경우에만 전달. 모르면 생략 (추측 금지)
- response_format은 항상 "markdown"으로 전달

## 응답 규칙
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
