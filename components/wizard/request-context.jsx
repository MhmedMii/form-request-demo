import { CalendarBlank, FirstAid, Clock, SignOut, WarningCircle } from '@phosphor-icons/react';
import { findDemoProfile } from '@/lib/demo-profiles';
import { findDepartmentById } from '@/lib/departments';
import { findRequestTypeById } from '@/lib/request-types';
const icons = {
  sick: FirstAid,
  late: Clock,
  excuse: SignOut,
  emergency: WarningCircle,
  leave: CalendarBlank,
};
export default function RequestContext({ form, locale, screen, isDone, text }) {
  const profile = findDemoProfile(form.profileId);
  const department = findDepartmentById(profile?.department);
  const type = findRequestTypeById(form.type);
  const label = (item) => (locale === 'ar' ? item?.nameAr : item?.nameEn);
  const showType = screen.kind !== 'profile' && Boolean(type);
  const Icon = icons[type?.id] || CalendarBlank;
  let hint = text.contextChooseType;
  if (screen.kind === 'profile') hint = text.contextIntro;
  else if (isDone) hint = text.contextComplete;
  else if (screen.kind === 'review') hint = text.contextReview;
  else if (screen.kind === 'dates') hint = text.contextReview;
  else if (screen.kind === 'pdf') hint = text.medicalPdfHint;
  else if (showType)
    hint = type.needsDates
      ? text.contextDates
      : type.needsPdf
        ? text.contextPdf
        : text.contextReason;
  return (
    <aside className="request-context" aria-label={text.contextLabel}>
      <div className="context-heading">
        <h2>{showType ? label(type) : text.contextTitle}</h2>
        <p>{hint}</p>
      </div>
      {!showType || type.needsDates ? (
        <div className="calendar-art" aria-hidden="true">
          <div className="calendar-binding">
            <span />
            <span />
          </div>
          <div className="calendar-grid">
            {Array.from({ length: 35 }, (_, index) => (
              <span
                key={index}
                className={
                  [9, 10, 11, 16, 17, 18].includes(index) ? 'calendar-day marked' : 'calendar-day'
                }
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="request-art" aria-hidden="true">
          <Icon size={94} weight="light" />
        </div>
      )}
      <div className="context-profile">
        <span className="section-caption">{text.contextProfileLabel}</span>
        <div className="context-profile-row">
          <span className="profile-avatar" aria-hidden="true">
            {profile?.initials || 'F'}
          </span>
          <div>
            <strong>{profile ? label(profile) : text.contextEmptyProfile}</strong>
            <p>{profile ? label(department) : text.fictionalProfile}</p>
          </div>
        </div>
      </div>
      <p className="context-demo-note">{text.contextDemoNote}</p>
    </aside>
  );
}
