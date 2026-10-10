import { findRequestTypeById } from './request-types.js';
import { findDemoProfile, findDemoReason } from './demo-profiles.js';
import { todayISO } from './today.js';
import { t } from './i18n.js';
export function validateIdentity(form, locale) {
  const profile = findDemoProfile(form.profileId);
  const valid =
    profile &&
    form.employeeName === profile.nameEn &&
    form.workEmail === profile.email &&
    form.phone === profile.contact &&
    form.department === profile.department;
  return valid ? {} : { profile: t(locale).errorPickProfile };
}
export function validateRequestDetails(form, locale) {
  const text = t(locale);
  const type = findRequestTypeById(form.type);
  if (!type) return { type: text.errorPickType };
  const errors = {};
  if (!findDemoReason(form.type, form.details)) errors.details = text.errorRequired;
  if (type.needsDates && (!form.fromDate || !form.toDate)) errors.dates = text.errorDates;
  else if (type.needsDates && form.fromDate < todayISO()) errors.dates = text.errorPastDate;
  else if (type.needsDates && form.toDate < form.fromDate) errors.dates = text.errorEndBeforeStart;
  if (type.needsPdf && form.pdfFile !== 'generated-demo-document') errors.pdf = text.errorPdf;
  return errors;
}
