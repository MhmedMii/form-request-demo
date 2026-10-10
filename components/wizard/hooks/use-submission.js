import { useState, useRef } from 'react';
import { firstIncompleteIndex, errorForScreen } from '@/lib/question-flow';
import { submitRequest } from '@/lib/submit-request';
import { buildRequestPayload } from '@/lib/build-request-payload';
import { clearSavedDraft } from '@/lib/save-draft-in-session';
const NO_RESULT = { requestId: '', isDone: false, submitError: '' };
export function useSubmission(options) {
  const { form, text, screens, locale, setQuestionIndex, setValidationError, resetForm } = options;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(NO_RESULT);
  const submitting = useRef(false);
  async function submit() {
    if (submitting.current) return;
    const incomplete = firstIncompleteIndex(screens, form, locale);
    if (incomplete !== -1) {
      setQuestionIndex(incomplete);
      setValidationError(errorForScreen(screens[incomplete], form, locale));
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    setResult(NO_RESULT);
    try {
      const response = await submitRequest(buildRequestPayload(form));
      if (!response.ok) throw new Error('Demo failed');
      clearSavedDraft();
      setResult({ requestId: response.requestId, isDone: true, submitError: '' });
    } catch {
      setResult({ ...NO_RESULT, submitError: text.errorGeneric });
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
    }
  }
  function startNewRequest() {
    clearSavedDraft();
    resetForm();
    setQuestionIndex(0);
    setValidationError('');
    setResult(NO_RESULT);
  }
  return { isSubmitting, ...result, submit, startNewRequest };
}
