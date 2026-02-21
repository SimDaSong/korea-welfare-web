'use client';

import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { Translations } from '@/lib/i18n';
import { LINKS } from '@/lib/constants';

interface InfoPopoverProps {
  t: Translations;
}

export default function InfoPopover({ t }: InfoPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <CircleAlert className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 text-sm">
        <div className="space-y-3">
          <p className="text-muted-foreground">{t.notice}</p>
          <div className="flex flex-col gap-1.5">
            <a
              href={LINKS.githubIssues}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t.reportIssue}
            </a>
            <a
              href={`mailto:${LINKS.email}`}
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t.contact}
            </a>
            <a
              href={LINKS.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t.buyCoffee}
            </a>
            <a
              href={LINKS.mcpServer}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80"
            >
              {t.mcpServer}
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
