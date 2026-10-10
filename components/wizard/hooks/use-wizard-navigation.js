import { useState } from 'react';
import {
  buildQuestionFlow,
  errorForScreen,
  STAGE_IDENTIFY,
  STAGE_REQUEST,
  STAGE_REVIEW,
} from '@/lib/question-flow';
import { identityForProfile } from '@/lib/demo-profiles';
export function useWizardNavigation(form, setForm, text, locale) {
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  const screens = buildQuestionFlow(form, text);
  const current = screens[Math.min(index, screens.length - 1)];
  const stageLabel = {
    [STAGE_IDENTIFY]: text.stepIdentify,
    [STAGE_REQUEST]: text.stepRequest,
    [STAGE_REVIEW]: text.stepReview,
  }[current.stage];
  return {
    index,
    setIndex,
    error,
    setError,
    screens,
    current,
    stageLabel,
    isReview: current.stage === STAGE_REVIEW,
    questionCounter: index + 1 + ' / ' + screens.length,
    updateField(field, value) {
      setForm((previous) => ({ ...previous, [field]: value }));
      setError('');
    },
    selectProfile(id) {
      const identity = identityForProfile(id);
      if (!identity) return;
      setForm((previous) => ({ ...previous, ...identity }));
      setError('');
      setIndex(1);
    },
    selectType(id) {
      setForm((previous) => ({
        ...previous,
        type: id,
        details: previous.type === id ? previous.details : '',
        pdfFile: '',
        pdfFileName: '',
      }));
      setError('');
    },
    goNext() {
      const problem = errorForScreen(current, form, locale);
      if (problem) {
        setError(problem);
        return;
      }
      setError('');
      setIndex((previous) => Math.min(previous + 1, screens.length - 1));
    },
    goBack() {
      setError('');
      setIndex((previous) => Math.max(0, previous - 1));
    },
  };
}
