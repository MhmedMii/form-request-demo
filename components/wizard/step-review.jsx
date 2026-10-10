import { findRequestTypeById } from '@/lib/request-types';
import { findDepartmentById } from '@/lib/departments';
import { findDemoProfile, findDemoReason } from '@/lib/demo-profiles';
export default function StepReview({ text, locale, form }) {
  const type = findRequestTypeById(form.type);
  const profile = findDemoProfile(form.profileId);
  const department = findDepartmentById(form.department);
  const reason = findDemoReason(form.type, form.details);
  const label = (object) => (locale === 'ar' ? object?.nameAr : object?.nameEn);
  const rows = [
    [text.fullName, label(profile)],
    [text.department, label(department)],
    [text.typeLabel, label(type)],
    [text.workEmail, profile?.email],
    [text.phone, profile?.contact],
  ];
  if (type?.needsDates)
    rows.push([text.fromDate + ' → ' + text.toDate, form.fromDate + ' → ' + form.toDate]);
  rows.push([text.details, locale === 'ar' ? reason?.ar : reason?.en]);
  if (type?.needsPdf) rows.push([text.attachmentLabel, text.fictionalDocument]);
  return (
    <div className="review-list">
      {rows.map(([key, value]) => (
        <div key={key} className="review-row">
          <span className="k">{key}</span>
          <span className="v" dir="auto">
            {value}
          </span>
        </div>
      ))}
      <p className="review-note">{text.reviewFootnote}</p>
    </div>
  );
}
