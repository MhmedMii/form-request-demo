// إجابة من قائمة منسدلة (القسم). الخيارات تنقرأ من lib/departments
// وهي المصدر الوحيد، والاسم يتبع لغة الواجهة بينما القيمة المخزّنة
// معرّف ثابت لا يتغيّر مع اللغة.

import { departments } from '@/lib/departments';

export default function AnswerSelect({ screen, value, locale, fieldAria, onChange }) {
  return (
    <select
      className="answer-input"
      name={screen.id}
      {...fieldAria}
      value={value}
      onChange={(event) => onChange(screen.id, event.target.value)}
      autoFocus
    >
      <option value="">{screen.placeholder}</option>
      {departments.map((department) => (
        <option key={department.id} value={department.id}>
          {locale === 'ar' ? department.nameAr : department.nameEn}
        </option>
      ))}
    </select>
  );
}
