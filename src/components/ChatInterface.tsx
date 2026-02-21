'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';
import Header from './Header';
import { getTranslations, type Language } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

/** UIMessage의 parts에서 텍스트를 추출 */
function getTextFromParts(parts: Array<{ type: string; text?: string }>): string {
  return parts
    .filter((p) => p.type === 'text' && p.text)
    .map((p) => p.text)
    .join('');
}

export default function ChatInterface() {
  const [lang, setLang] = useState<Language>('ko');
  const t = getTranslations(lang);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { messages, sendMessage, status } = useChat({
    onError(error) {
      setErrorMessage(error.message || t.error);
    },
  });
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, errorMessage]);

  const send = (text: string) => {
    if (!text.trim() || isLoading) return;
    setErrorMessage(null);
    sendMessage({ text }, { body: { lang } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <Header t={t} lang={lang} onLanguageChange={setLang} />

      {/* 메시지 영역 */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 pt-20">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-foreground">
                    {t.heading}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t.subheading}
                  </p>
                </div>
                <SuggestedQuestions
                  suggestions={t.suggestions}
                  onSelect={(q) => send(q)}
                />
              </div>
            ) : (
              <>
                {messages.map((m) => {
                  const text = getTextFromParts(m.parts as Array<{ type: string; text?: string }>);
                  if (!text) return null;
                  return (
                    <MessageBubble
                      key={m.id}
                      role={m.role as 'user' | 'assistant'}
                      content={text}
                    />
                  );
                })}
                {status === 'submitted' && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                      <span>{t.searching}</span>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                )}
                {/* 에러를 어시스턴트 채팅 메시지로 표시 */}
                {errorMessage && (
                  <MessageBubble role="assistant" content={errorMessage} />
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </ScrollArea>

      {/* 입력 영역 */}
      <div className="border-t border-border bg-background px-4 py-3">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl min-h-0 py-3"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-xl px-4 py-3"
          >
            {t.send}
          </Button>
        </form>
      </div>
    </div>
  );
}
