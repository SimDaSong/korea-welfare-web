import { describe, it, expect } from 'vitest';
import {
  LANGUAGES,
  LANGUAGE_LABELS,
  LANGUAGE_INSTRUCTIONS,
  getTranslations,
  type Language,
} from '../i18n';

describe('i18n', () => {
  it('모든 언어에 대해 번역을 반환한다', () => {
    for (const lang of LANGUAGES) {
      const t = getTranslations(lang);
      expect(t.title).toBeTruthy();
      expect(t.heading).toBeTruthy();
      expect(t.placeholder).toBeTruthy();
      expect(t.send).toBeTruthy();
      expect(t.suggestions.length).toBeGreaterThan(0);
    }
  });

  it('모든 언어에 레이블이 있다', () => {
    for (const lang of LANGUAGES) {
      expect(LANGUAGE_LABELS[lang]).toBeTruthy();
    }
  });

  it('모든 언어에 시스템 프롬프트 지시문이 있다', () => {
    for (const lang of LANGUAGES) {
      expect(LANGUAGE_INSTRUCTIONS[lang]).toBeTruthy();
    }
  });

  it('각 언어의 추천 질문 수가 동일하다', () => {
    const koCount = getTranslations('ko').suggestions.length;
    for (const lang of LANGUAGES) {
      expect(getTranslations(lang).suggestions.length).toBe(koCount);
    }
  });

  it('ko 번역은 한국어 텍스트를 포함한다', () => {
    const t = getTranslations('ko');
    expect(t.title).toContain('복지');
    expect(t.send).toBe('전송');
  });

  it('en 번역은 영어 텍스트를 포함한다', () => {
    const t = getTranslations('en');
    expect(t.title).toContain('Welfare');
    expect(t.send).toBe('Send');
  });
});
