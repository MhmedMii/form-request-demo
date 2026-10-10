import { identityForProfile, findDemoReason } from './demo-profiles.js';
import { findRequestTypeById } from './request-types.js';
const DRAFT_KEY = 'form-portfolio-demo-draft-v1';
export function saveDraft(form, questionIndex) {
  const identity = identityForProfile(form.profileId);
  if (!identity) return;
  const safe = {
    ...identity,
    type: findRequestTypeById(form.type) ? form.type : '',
    details: findDemoReason(form.type, form.details) ? form.details : '',
    fromDate: /^\d{4}-\d{2}-\d{2}$/.test(form.fromDate || '') ? form.fromDate : '',
    toDate: /^\d{4}-\d{2}-\d{2}$/.test(form.toDate || '') ? form.toDate : '',
    pdfFile: '',
    pdfFileName: '',
  };
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form: safe, questionIndex }));
  } catch {}
}
export function readSavedDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
    const identity = identityForProfile(draft?.form?.profileId);
    if (!identity) return null;
    const original = draft.form;
    return {
      form: {
        ...identity,
        type: findRequestTypeById(original.type) ? original.type : '',
        details: findDemoReason(original.type, original.details) ? original.details : '',
        fromDate: /^\d{4}-\d{2}-\d{2}$/.test(original.fromDate || '') ? original.fromDate : '',
        toDate: /^\d{4}-\d{2}-\d{2}$/.test(original.toDate || '') ? original.toDate : '',
        pdfFile: '',
        pdfFileName: '',
      },
      questionIndex: Number.isInteger(draft.questionIndex) ? draft.questionIndex : 0,
    };
  } catch {
    return null;
  }
}
export function clearSavedDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {}
}
