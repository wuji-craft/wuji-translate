import { ref, watchEffect } from 'vue';
import { createI18n } from 'vue-i18n';
import { browser } from 'wxt/browser';
import { storage } from 'wxt/utils/storage';
import en from '../public/_locales/en/messages.json';
import zhCN from '../public/_locales/zh_CN/messages.json';

// 新增语言时，在此注册资源和选项，业务组件无需添加语言判断。
export const languages = [
  { code: 'en', labelKey: 'languageEnglish', messages: en },
  { code: 'zh-CN', labelKey: 'languageChinese', messages: zhCN },
] as const;

type Locale = (typeof languages)[number]['code'];
export type LanguagePreference = 'system' | Locale;
const languageSetting = storage.defineItem<LanguagePreference>('local:interfaceLanguage', {
  fallback: 'system',
});
export const languagePreference = ref<LanguagePreference>('system');

function isPreference(value: unknown): value is LanguagePreference {
  return value === 'system' || languages.some((language) => language.code === value);
}

function resolveLocale(preference: LanguagePreference): Locale {
  if (preference !== 'system') return preference;
  const browserLocale = browser.i18n.getUILanguage().toLowerCase().replaceAll('_', '-');
  const exact = languages.find((language) => language.code.toLowerCase() === browserLocale);
  const base = languages.find((language) => language.code.split('-')[0] === browserLocale.split('-')[0]);
  return (exact ?? base)?.code ?? 'en';
}

const messages = Object.fromEntries(languages.map((language) => [
  language.code,
  Object.fromEntries(Object.entries(language.messages).map(([key, value]) => [key, value.message])),
]));

export const i18n = createI18n({
  legacy: false,
  locale: resolveLocale('system'),
  fallbackLocale: 'en',
  messages,
});

function applyPreference(value: unknown) {
  languagePreference.value = isPreference(value) ? value : 'system';
  i18n.global.locale.value = resolveLocale(languagePreference.value);
}

export async function initializeI18n() {
  // 即使存储暂不可用，界面仍能按浏览器语言打开。
  try {
    applyPreference(await languageSetting.getValue());
  } catch (error) {
    console.error('Failed to read interface language', error);
  }
  const unwatch = languageSetting.watch(applyPreference);
  window.addEventListener('pagehide', unwatch, { once: true });
  watchEffect(() => {
    document.documentElement.lang = i18n.global.locale.value;
    document.title = i18n.global.t('extName');
  });
}

export async function setLanguagePreference(value: LanguagePreference) {
  if (!isPreference(value)) throw new Error('Unsupported interface language');
  await languageSetting.setValue(value);
  applyPreference(value);
}
