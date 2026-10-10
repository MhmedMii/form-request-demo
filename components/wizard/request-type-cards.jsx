import {
  FirstAid,
  Clock,
  SignOut,
  WarningCircle,
  CalendarBlank,
  ArrowRight,
} from '@phosphor-icons/react';
import { requestTypes } from '@/lib/request-types';
const ICONS = {
  sick: FirstAid,
  late: Clock,
  excuse: SignOut,
  emergency: WarningCircle,
  leave: CalendarBlank,
};
export default function RequestTypeCards({ locale, selectedType, onSelect }) {
  return (
    <div className="type-list">
      {requestTypes.map((type, index) => {
        const Icon = ICONS[type.id];
        return (
          <button
            key={type.id}
            className={'type-card ' + (selectedType === type.id ? 'selected' : '')}
            onClick={() => onSelect(type.id)}
          >
            <span className="type-icon">
              <Icon size={22} />
            </span>
            <span className="type-copy">
              <strong>{locale === 'ar' ? type.nameAr : type.nameEn}</strong>
              <small>{locale === 'ar' ? type.descriptionAr : type.descriptionEn}</small>
            </span>
            <span className="type-number">{String(index + 1).padStart(2, '0')}</span>
            <ArrowRight size={17} className="directional" />
          </button>
        );
      })}
    </div>
  );
}
