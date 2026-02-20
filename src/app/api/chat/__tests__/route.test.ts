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
    toTextStreamResponse: vi.fn().mockReturnValue(
      new Response('streamed response', { status: 200 })
    ),
  }),
  stepCountIs: vi.fn().mockReturnValue('stepCountIs(5)'),
}));

vi.mock('@ai-sdk/openai', () => ({
  openai: vi.fn().mockReturnValue('gpt-4o-mini-model'),
}));

import { POST } from '../route';
import { createMCPClient } from '@ai-sdk/mcp';
import { Experimental_StdioMCPTransport } from '@ai-sdk/mcp/mcp-stdio';
import { streamText, stepCountIs } from 'ai';
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

    // 매 테스트마다 mock 재설정
    vi.mocked(createMCPClient).mockResolvedValue({
      tools: vi.fn().mockResolvedValue({
        welfare_search_benefits: { description: '복지 검색' },
      }),
      close: vi.fn().mockResolvedValue(undefined),
    } as any);

    vi.mocked(streamText).mockReturnValue({
      toTextStreamResponse: vi.fn().mockReturnValue(
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

  it('streamText에 올바른 파라미터를 전달한다', async () => {
    const messages = [{ role: 'user', content: '출산 지원금 알려줘' }];
    const req = createMockRequest({ messages });

    await POST(req);

    expect(openai).toHaveBeenCalledWith('gpt-4o-mini');
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gpt-4o-mini-model',
        messages,
        tools: expect.any(Object),
        stopWhen: 'stepCountIs(5)',
      })
    );
    expect(stepCountIs).toHaveBeenCalledWith(5);
  });

  it('시스템 프롬프트에 한국어 복지 안내가 포함된다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    await POST(req);

    const callArgs = vi.mocked(streamText).mock.calls[0][0];
    expect(callArgs.system).toContain('한국 복지 혜택');
    expect(callArgs.system).toContain('한국어');
  });

  it('스트리밍 응답을 반환한다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    const response = await POST(req);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);
  });

  it('응답 후 MCP 클라이언트를 종료한다', async () => {
    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    await POST(req);

    const mcpClient = await getMCPClientMock();
    expect(mcpClient.close).toHaveBeenCalledOnce();
  });

  it('streamText에서 에러 발생 시에도 MCP 클라이언트를 종료한다', async () => {
    vi.mocked(streamText).mockImplementationOnce(() => {
      throw new Error('LLM 호출 실패');
    });

    const req = createMockRequest({
      messages: [{ role: 'user', content: '테스트' }],
    });

    await expect(POST(req)).rejects.toThrow('LLM 호출 실패');

    const mcpClient = await getMCPClientMock();
    expect(mcpClient.close).toHaveBeenCalledOnce();
  });
});
