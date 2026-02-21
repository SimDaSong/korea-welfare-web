import Markdown from 'react-markdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  variant?: 'default' | 'error';
}

export default function MessageBubble({ role, content, variant = 'default' }: MessageBubbleProps) {
  const isUser = role === 'user';

  const bubbleClass = isUser
    ? 'bg-primary text-primary-foreground'
    : variant === 'error'
      ? 'bg-destructive/10 text-destructive'
      : 'bg-muted text-foreground';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${bubbleClass}`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-h2:text-base prose-h2:mt-5 prose-h3:text-sm prose-h3:font-semibold prose-h3:mt-4 prose-hr:my-3">
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
