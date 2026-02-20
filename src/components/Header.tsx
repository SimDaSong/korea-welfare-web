import { LANGUAGES, LANGUAGE_LABELS, type Language, type Translations } from '@/lib/i18n';

interface HeaderProps {
  t: Translations;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Header({ t, lang, onLanguageChange }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {t.title}
          </h1>
          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {t.badge}
          </span>
        </div>
        <select
          value={lang}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700 outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        >
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {LANGUAGE_LABELS[l]}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
