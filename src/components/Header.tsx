'use client';

import { LANGUAGES, LANGUAGE_LABELS, type Language, type Translations } from '@/lib/i18n';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface HeaderProps {
  t: Translations;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ t, lang, onLanguageChange }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-foreground">
            {t.title}
          </h1>
          <Badge className="ml-2 bg-primary/10 text-primary hover:bg-primary/10">
            {t.badge}
          </Badge>
        </div>
        <Select value={lang} onValueChange={(v) => onLanguageChange(v as Language)}>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l} value={l}>
                {LANGUAGE_LABELS[l]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
