export const LANGUAGES = ['ko', 'en', 'ja', 'zh'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_LABELS: Record<Language, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
  zh: '中文',
};

const translations = {
  ko: {
    title: '복지 혜택 검색',
    badge: 'AI',
    heading: '어떤 복지 혜택을 찾고 계신가요?',
    subheading: '나이, 지역, 상황을 알려주시면 맞춤 복지 혜택을 찾아드립니다',
    placeholder: '복지 혜택에 대해 질문해보세요...',
    send: '전송',
    searching: '검색 중...',
    error: '오류가 발생했습니다. 다시 시도해주세요.',
    suggestions: [
      '청년 주거 지원 알려줘',
      '서울 거주 30대가 받을 수 있는 혜택은?',
      '출산 지원금 종류가 뭐가 있어?',
      '실업급여 신청 방법 알려줘',
    ],
  },
  en: {
    title: 'Welfare Benefits Search',
    badge: 'AI',
    heading: 'What welfare benefits are you looking for?',
    subheading: 'Tell us your age, region, and situation to find benefits for you',
    placeholder: 'Ask about welfare benefits...',
    send: 'Send',
    searching: 'Searching...',
    error: 'An error occurred. Please try again.',
    suggestions: [
      'Housing support for young adults',
      'Benefits for 30s living in Seoul?',
      'What childbirth subsidies are available?',
      'How to apply for unemployment benefits?',
    ],
  },
  ja: {
    title: '福祉給付検索',
    badge: 'AI',
    heading: 'どのような福祉給付をお探しですか？',
    subheading: '年齢、地域、状況を教えていただければ、最適な給付を見つけます',
    placeholder: '福祉給付について質問してください...',
    send: '送信',
    searching: '検索中...',
    error: 'エラーが発生しました。もう一度お試しください。',
    suggestions: [
      '若者向け住宅支援を教えて',
      'ソウル在住30代が受けられる給付は？',
      '出産支援金の種類は？',
      '失業給付の申請方法を教えて',
    ],
  },
  zh: {
    title: '福利搜索',
    badge: 'AI',
    heading: '您在寻找什么福利？',
    subheading: '告诉我们您的年龄、地区和情况，为您寻找合适的福利',
    placeholder: '询问福利相关问题...',
    send: '发送',
    searching: '搜索中...',
    error: '发生错误，请重试。',
    suggestions: [
      '青年住房支持有哪些',
      '首尔30多岁可以享受什么福利？',
      '生育补贴有哪些种类？',
      '如何申请失业救济金？',
    ],
  },
};

export interface Translations {
  title: string;
  badge: string;
  heading: string;
  subheading: string;
  placeholder: string;
  send: string;
  searching: string;
  error: string;
  suggestions: readonly string[];
}

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

/** 시스템 프롬프트에 추가할 언어 지시문 */
export const LANGUAGE_INSTRUCTIONS: Record<Language, string> = {
  ko: '응답은 항상 한국어로 제공하세요.',
  en: 'Always respond in English.',
  ja: '必ず日本語で回答してください。',
  zh: '请始终用中文回答。',
};