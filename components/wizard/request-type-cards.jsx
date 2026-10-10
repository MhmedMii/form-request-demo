import {
  FirstAid,
  Clock,
  SignOut,
  WarningCircle,
  CalendarBlank,
  Check,
} from '@phosphor-icons/react';
import { requestTypes } from '@/lib/request-types';
const ICONS = {
  sick: FirstAid,
  late: Clock,
  excuse: SignOut,
  emergency: WarningCircle,
  leave: CalendarBlank,
};
export default function RequestTypeCards({ locale, selectedType, onSelect, fieldAria }) {
  return (
    <div className="type-list" role="group" {...fieldAria}>
      {requestTypes.map((type) => {
        const Icon = ICONS[type.id];
        return (
          <button
            key={type.id}
            className={'type-card ' + (selectedType === type.id ? 'selected' : '')}
            aria-pressed={selectedType === type.id}
            onClick={() => onSelect(type.id)}
          >
            <span className="type-icon">
              <Icon size={30} weight="light" />
            </span>
            <span className="type-copy">
              <strong>{locale === 'ar' ? type.nameAr : type.nameEn}</strong>
              <small>{locale === 'ar' ? type.descriptionAr : type.descriptionEn}</small>
            </span>
            <span className="selection-circle" aria-hidden="true">
              {selectedType === type.id && <Check size={13} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
