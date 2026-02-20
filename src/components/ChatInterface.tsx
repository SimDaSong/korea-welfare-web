'use client';

import { useChat } from '@ai-sdk/react';
import { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';
import Header from './Header';
import { getTranslations, type Language } from '@/lib/i18n';

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

  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isLoading = status === 'submitted' || status === 'streaming';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim() || isLoading) return;
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
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-6 pt-20">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {t.heading}
                </h2>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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
                  <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    {t.searching}
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 에러 표시 */}
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-center text-sm text-red-600 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {t.error}
        </div>
      )}

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t.send}
          </button>
        </form>
      </div>
    </div>
  );
}
