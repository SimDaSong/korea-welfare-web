import Markdown from 'react-markdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-h2:mt-6 prose-h3:mt-5 prose-hr:my-4">
            <Markdown
              components={{
                a: ({ children, href, ...props }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </Markdown>
          </div>
        )}
      </div>
    </div>
  );
}
