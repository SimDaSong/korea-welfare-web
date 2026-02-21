import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@ai-sdk/mcp', () => ({
  createMCPClient: vi.fn().mockResolvedValue({
    tools: vi.fn().mockResolvedValue({
      welfare_search_benefits: { description: '복지 검색' },
    }),
    close: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock('@ai-sdk/mcp/mcp-stdio', () => ({
  Experimental_StdioMCPTransport: vi.fn(),
}));

vi.mock('ai', () => ({
  streamText: vi.fn().mockReturnValue({
    toUIMessageStreamResponse: vi.fn().mockReturnValue(
      new Response('streamed response', { status: 200 })
    ),
  }),
  stepCountIs: vi.fn().mockReturnValue('stepCountIs(5)'),
  convertToModelMessages: vi.fn().mockResolvedValue([
    { role: 'user', content: 'converted message' },
  ]),
}));

vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn().mockReturnValue('gpt-4o-mini-model'),
}));

import { POST } from '../route';
import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { streamText, stepCountIs, convertToModelMessages } from 'ai';
import { openai } from '@ai-sdk/openai';

function createMockRequest(body: object): Request {
  return new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

/** createMCPClient의 mock 반환값에서 내부 함수 가져오기 */
function getMCPClientMock() {
  const mock = vi.mocked(createMCPClient);
  return mock.mock.results[mock.mock.results.length - 1]?.value;
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(createMCPClient).mockResolvedValue({
      tools: vi.fn().mockResolvedValue({
        welfare_search_benefits: { description: '복지 검색' },
      }),
      close: vi.fn().mockResolvedValue(undefined),
    } as any);

    vi.mocked(streamText).mockReturnValue({
      toUIMessageStreamResponse: vi.fn().mockReturnValue(
        new Response('streamed response', { status: 200 })
      ),
    } as any);
  });

  it('MCP 클라이언트를 생성하고 도구를 가져온다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '청년 주거 지원 알려줘' }],
    });

    await POST(req);

    expect(createMCPClient).toHaveBeenCalledOnce();
    expect(Experimental_StdioMCPTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        command: 'node',
        args: ['node_modules/korea-welfare-mcp-server/dist/index.js'],
      })
    );

    const mcpClient = await getMCPClientMock();
    expect(mcpClient.tools).toHaveBeenCalledOnce();
  });

  it('UI 메시지를 모델 메시지로 변환하여 streamText에 전달한다', async () => {
    const uiMessages = [{ role: 'user', content: '출산 지원금 알려줘' }];
    const convertedMessages = [{ role: 'user', content: 'converted message' }];
    vi.mocked(convertToModelMessages).mockResolvedValueOnce(convertedMessages as any);

    const req = createMockRequest({ messages: uiMessages });
    await POST(req);

    expect(convertToModelMessages).toHaveBeenCalledWith(uiMessages);
    expect(openai).toHaveBeenCalledWith('gpt-4o-mini');
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini-model',
        messages: convertedMessages,
        tools: expect.any(Object),
        stopWhen: 'stepCountIs(5)',
      })
    );
    expect(stepCountIs).toHaveBeenCalledWith(5);
  });

  it('toUIMessageStreamResponse로 스트리밍 응답을 반환한다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    const response = await POST(req);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    const mockResult = vi.mocked(streamText).mock.results[0].value;
    expect(mockResult.toUIMessageStreamResponse).toHaveBeenCalledWith(
      expect.objectContaining({ onError: expect.any(Function) })
    );
  });

  it('streamText에 onFinish 콜백을 전달한다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    await POST(req);

    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    expect(callArgs.onFinish).toBeTypeOf('function');
  });

  it('lang이 없으면 기본 한국어 시스템 프롬프트를 사용한다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    await POST(req);

    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    expect(callArgs.system).toContain('한국 복지 혜택');
    expect(callArgs.system).toContain('한국어');
  });

  it('lang=en이면 영어 응답 지시문이 포함된다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: 'test' }],
      lang: 'en',
    });

    await POST(req);

    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    expect(callArgs.system).toContain('English');
  });

  it('lang=ja이면 일본어 응답 지시문이 포함된다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: 'テスト' }],
      lang: 'ja',
    });

    await POST(req);

    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    expect(callArgs.system).toContain('日本語');
  });

  describe('에러 핸들링', () => {
    it('streamText 이전 에러 시 500 JSON 응답을 반환하고 MCP를 종료한다', async () => {
      vi.mocked(createMCPClient).mockRejectedValueOnce(new Error('MCP 연결 실패'));

      const req = createMockRequest({
        messages: [{ role: 'user', content: '테스트' }],
      });

      const response = await POST(req);
      const body = await response.json();

      expect(response.status).toBe(500);
      expect(body.error).toContain('일시적인 문제');
    });

    it('toUIMessageStreamResponse의 onError가 quota 에러를 변환한다', async () => {
      const req = createMockRequest({
        messages: [{ role: 'user', content: '테스트' }],
      });

      await POST(req);

      /** toUIMessageStreamResponse에 전달된 onError 추출 */
      const mockResult = vi.mocked(streamText).mock.results[0].value;
      const { onError } = mockResult.toUIMessageStreamResponse.mock.calls[0][0];

      const result = onError(new Error('exceeded your current quota'));
      expect(result).toContain('일일 요청 한도');
    });

    it('toUIMessageStreamResponse의 onError가 API 키 에러를 변환한다', async () => {
      const req = createMockRequest({
        messages: [{ role: 'user', content: '테스트' }],
      });

      await POST(req);

      const mockResult = vi.mocked(streamText).mock.results[0].value;
      const { onError } = mockResult.toUIMessageStreamResponse.mock.calls[0][0];

      const result = onError(new Error('invalid_api_key'));
      expect(result).toContain('이용할 수 없습니다');
    });

    it('toUIMessageStreamResponse의 onError가 일반 에러를 변환한다', async () => {
      const req = createMockRequest({
        messages: [{ role: 'user', content: '테스트' }],
      });

      await POST(req);

      const mockResult = vi.mocked(streamText).mock.results[0].value;
      const { onError } = mockResult.toUIMessageStreamResponse.mock.calls[0][0];

      const result = onError(new Error('unknown error'));
      expect(result).toContain('일시적인 문제');
    });

    it('onError에서 MCP 클라이언트를 종료한다', async () => {
      const req = createMockRequest({
        messages: [{ role: 'user', content: '테스트' }],
      });

      await POST(req);

      const mockResult = vi.mocked(streamText).mock.results[0].value;
      const { onError } = mockResult.toUIMessageStreamResponse.mock.calls[0][0];
      onError(new Error('test error'));

      const mcpClient = await getMCPClientMock();
      expect(mcpClient.close).toHaveBeenCalled();
    });
  });
});
