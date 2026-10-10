import { findRequestTypeById } from './request-types.js';
import { validateIdentity, validateRequestDetails } from './validate-request.js';
export const STAGE_IDENTIFY = 'identify';
export const STAGE_REQUEST = 'request';
export const STAGE_REVIEW = 'review';
export function buildQuestionFlow(form, text) {
  const type = findRequestTypeById(form.type);
  const screens = [
    {
      id: 'profile',
      stage: STAGE_IDENTIFY,
      kind: 'profile',
      chip: text.chipName,
      question: text.qName,
      hint: text.qNameHint,
    },
    {
      id: 'type',
      stage: STAGE_REQUEST,
      kind: 'type',
      chip: text.chipType,
      question: text.qType,
      hint: text.qTypeHint,
    },
    {
      id: 'details',
      stage: STAGE_REQUEST,
      kind: 'scenario',
      chip: text.chipDetails,
      question: text.qDetails,
      hint: text.qDetailsHint,
    },
  ];
  if (type?.needsDates)
    screens.push({
      id: 'dates',
      stage: STAGE_REQUEST,
      kind: 'dates',
      chip: text.chipDates,
      question: text.qDates,
      hint: text.qDatesHint,
    });
  if (type?.needsPdf)
    screens.push({
      id: 'pdf',
      stage: STAGE_REQUEST,
      kind: 'pdf',
      chip: text.chipPdf,
      question: text.qPdf,
      hint: text.medicalPdfHint,
    });
  screens.push({
    id: 'review',
    stage: STAGE_REVIEW,
    kind: 'review',
    chip: text.chipReview,
    question: text.qReview,
    hint: text.qReviewHint,
  });
  return screens;
}
export function errorForScreen(screen, form, locale) {
  if (screen.stage === STAGE_IDENTIFY) return validateIdentity(form, locale)[screen.id];
  if (screen.stage === STAGE_REQUEST) return validateRequestDetails(form, locale)[screen.id];
  return undefined;
}
export function firstIncompleteIndex(screens, form, locale) {
  return screens.findIndex((screen) => errorForScreen(screen, form, locale));
}
