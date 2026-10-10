import { findDemoProfile, findDemoReason } from './demo-profiles.js';
import { findDepartmentById } from './departments.js';
import { findRequestTypeById } from './request-types.js';
export function buildRequestPayload(form) {
  const profile = findDemoProfile(form.profileId);
  const type = findRequestTypeById(form.type);
  const reason = findDemoReason(form.type, form.details);
  if (!profile || !type || !reason) throw new Error('Only generated demo records are accepted.');
  return {
    demo: true,
    profileId: profile.id,
    type: type.id,
    employeeName: profile.nameEn,
    workEmail: profile.email,
    phone: profile.contact,
    department: findDepartmentById(profile.department).nameEn,
    details: reason.en,
    fromDate: type.needsDates ? form.fromDate : '',
    toDate: type.needsDates ? form.toDate : '',
    attachment: type.needsPdf ? 'DEMO - FICTIONAL DOCUMENT' : '',
  };
}
