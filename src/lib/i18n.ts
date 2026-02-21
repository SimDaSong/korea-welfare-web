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
    notice: '현재 시범 운영 중이며, 요청 한도가 빠르게 소진될 수 있습니다. 한도 초과 시 일정 시간 동안 서비스 이용이 제한됩니다.',
    disclaimer: '대화 내용은 저장되지 않습니다. AI 답변은 부정확할 수 있으니 반드시 관련 기관에 직접 문의하고, 참고용으로만 활용하세요.',
    reportIssue: '이슈 제보',
    contact: '문의',
    buyCoffee: '개발자에게 커피 사주기',
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
    notice: 'This service is in beta. Request limits may be reached quickly. If exceeded, the service will be temporarily unavailable.',
    disclaimer: 'Conversations are not stored. AI responses may be inaccurate — always contact the relevant authority directly and use this for reference only.',
    reportIssue: 'Report an issue',
    contact: 'Contact',
    buyCoffee: 'Buy me a coffee',
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
    notice: '現在ベータ運用中です。リクエスト制限に達する場合があります。制限を超えると一時的にサービスをご利用いただけません。',
    disclaimer: '会話内容は保存されません。AIの回答は不正確な場合があります。必ず関係機関に直接お問い合わせのうえ、参考としてご利用ください。',
    reportIssue: '問題を報告',
    contact: 'お問い合わせ',
    buyCoffee: '開発者にコーヒーをおごる',
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
    notice: '目前处于测试阶段，请求额度可能很快用完。超出额度后，服务将暂时不可用。',
    disclaimer: '对话内容不会被保存。AI回答可能存在误差，请务必直接联系相关机构，仅供参考使用。',
    reportIssue: '报告问题',
    contact: '联系我们',
    buyCoffee: '请开发者喝杯咖啡',
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
  notice: string;
  disclaimer: string;
  reportIssue: string;
  contact: string;
  buyCoffee: string;
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