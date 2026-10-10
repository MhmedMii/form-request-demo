import { ArrowUpRight, Check } from '@phosphor-icons/react';
import { demoProfiles } from '@/lib/demo-profiles';
import { findDepartmentById } from '@/lib/departments';
export default function AnswerProfile({ form, locale, onSelectProfile, fieldAria, text }) {
  return (
    <div className="profile-list" role="group" {...fieldAria}>
      {demoProfiles.map((profile) => {
        const department = findDepartmentById(profile.department);
        return (
          <button
            key={profile.id}
            className={'profile-card ' + (form.profileId === profile.id ? 'selected' : '')}
            aria-pressed={form.profileId === profile.id}
            onClick={() => onSelectProfile(profile.id)}
          >
            <span className={'profile-avatar ' + profile.tone}>{profile.initials}</span>
            <span className="profile-copy">
              <strong>{locale === 'ar' ? profile.nameAr : profile.nameEn}</strong>
              <small>
                {locale === 'ar' ? department.nameAr : department.nameEn} · {text.fictionalProfile}
              </small>
            </span>
            {form.profileId === profile.id ? <Check size={20} /> : <ArrowUpRight size={20} />}
          </button>
        );
      })}
      <p className="field-footnote">{text.profileFootnote}</p>
    </div>
  );
}
