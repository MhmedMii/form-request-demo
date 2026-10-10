'use client';
import { useState } from 'react';
import WizardLayout from './wizard-layout';
import WizardStage from './wizard-stage';
import { t } from '@/lib/i18n';
import { buildQuestionFlow, firstIncompleteIndex } from '@/lib/question-flow';
import { useDevicePreferences } from './hooks/use-device-preferences';
import { useDraftPersistence } from './hooks/use-draft-persistence';
import { useWizardNavigation } from './hooks/use-wizard-navigation';
import { usePdfAttachment } from './hooks/use-pdf-attachment';
import { useSubmission } from './hooks/use-submission';
import { clearSavedDraft } from '@/lib/save-draft-in-session';
const EMPTY_FORM = {
  profileId: '',
  employeeName: '',
  workEmail: '',
  phone: '',
  department: '',
  type: '',
  details: '',
  fromDate: '',
  toDate: '',
  pdfFile: '',
  pdfFileName: '',
};
export default function RequestWizard() {
  const [form, setForm] = useState(EMPTY_FORM);
  const preferences = useDevicePreferences();
  const { locale } = preferences;
  const text = t(locale);
  const nav = useWizardNavigation(form, setForm, text, locale);
  const attachment = usePdfAttachment(setForm, nav.setError, text);
  const submission = useSubmission({
    screens: nav.screens,
    form,
    locale,
    text,
    setQuestionIndex: nav.setIndex,
    setValidationError: nav.setError,
    resetForm: () => setForm(EMPTY_FORM),
  });
  useDraftPersistence({
    form,
    questionIndex: nav.index,
    onRestore: (draft) => {
      const restored = { ...EMPTY_FORM, ...draft.form };
      const screens = buildQuestionFlow(restored, text);
      const incomplete = firstIncompleteIndex(screens, restored, locale);
      const savedIndex = Math.min(draft.questionIndex || 0, screens.length - 1);
      setForm(restored);
      nav.setIndex(incomplete === -1 ? savedIndex : Math.min(savedIndex, incomplete));
    },
  });
  function reset() {
    clearSavedDraft();
    submission.startNewRequest();
  }
  function handleKey(event) {
    if (
      event.key !== 'Enter' ||
      nav.isReview ||
      ['BUTTON', 'A', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) ||
      ['date', 'file'].includes(event.target.type)
    )
      return;
    event.preventDefault();
    nav.goNext();
  }
  return (
    <WizardLayout
      text={text}
      context={{ form, locale, screen: nav.current, isDone: submission.isDone }}
      onKeyDown={handleKey}
      rail={{
        screens: nav.screens,
        index: submission.isDone ? nav.screens.length : nav.index,
        stageLabel: submission.isDone ? text.stepReview : nav.stageLabel,
      }}
      topBar={{
        theme: preferences.theme,
        counter: submission.isDone ? '' : nav.questionCounter,
        onToggleLocale: preferences.toggleLocale,
        onToggleTheme: preferences.toggleTheme,
        onReset: reset,
      }}
    >
      <WizardStage
        nav={nav}
        submission={submission}
        attachment={attachment}
        form={form}
        text={text}
        locale={locale}
      />
    </WizardLayout>
  );
}
