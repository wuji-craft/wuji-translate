<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { languages, languagePreference, setLanguagePreference, type LanguagePreference } from '@/i18n';

const { t } = useI18n();
const saving = ref(false);
const saveFailed = ref(false);

async function changeLanguage(event: Event) {
  const select = event.target as HTMLSelectElement;
  saving.value = true;
  saveFailed.value = false;
  try {
    await setLanguagePreference(select.value as LanguagePreference);
  } catch {
    select.value = languagePreference.value;
    saveFailed.value = true;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main>
    <h1>{{ t('extName') }}</h1>
    <p>{{ t('setupReady') }}</p>
    <label for="interface-language">{{ t('interfaceLanguage') }}</label>
    <select id="interface-language" :value="languagePreference" :disabled="saving" @change="changeLanguage">
      <option value="system">{{ t('followBrowser') }}</option>
      <option v-for="language in languages" :key="language.code" :value="language.code">
        {{ t(language.labelKey) }}
      </option>
    </select>
    <p v-if="saveFailed" role="alert">{{ t('saveFailed') }}</p>
  </main>
</template>
