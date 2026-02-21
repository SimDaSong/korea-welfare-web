import type { Translations } from '@/lib/i18n';
import { LINKS } from '@/lib/constants';

interface ServiceNoticeProps {
  t: Translations;
}

export default function ServiceNotice({ t }: ServiceNoticeProps) {
  return (
    <div className="mt-8 flex flex-col items-center gap-3 text-xs text-muted-foreground">
      <p className="max-w-sm text-center">{t.notice}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={LINKS.githubIssues}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {t.reportIssue}
        </a>
        <span className="text-border">|</span>
        <a
          href={`mailto:${LINKS.email}`}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {t.contact}
        </a>
        <span className="text-border">|</span>
        <a
          href={LINKS.buyMeACoffee}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {t.buyCoffee}
        </a>
      </div>
    </div>
  );
}
