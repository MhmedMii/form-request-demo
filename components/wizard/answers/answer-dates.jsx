// إجابة بتاريخين (طلب الإجازة). خانتان في سؤال واحد لأنهما مدة
// واحدة لا سؤالان. أقل تاريخ مسموح: اليوم للبداية، وتاريخ البداية
// للنهاية — فيقفل المتصفّح الخيار الخاطئ قبل ما يكتبه الموظف.

import { todayISO } from '@/lib/today';

export default function AnswerDates({ text, form, errorId, hasError, onChange }) {
  // الخطأ واحد للخانتين (رسالة المدة)، فنربطه بكلتيهما.
  const dateAria = {
    'aria-describedby': hasError ? errorId : undefined,
    'aria-invalid': hasError ? true : undefined,
  };

  return (
    <div className="answer-dates">
      <label className="date-box">
        <span>{text.fromDate}</span>
        <input
          type="date"
          name="fromDate"
          value={form.fromDate}
          min={todayISO()}
          aria-label={text.fromDate}
          {...dateAria}
          onChange={(event) => onChange('fromDate', event.target.value)}
        />
      </label>
      <label className="date-box">
        <span>{text.toDate}</span>
        <input
          type="date"
          name="toDate"
          value={form.toDate}
          min={form.fromDate || todayISO()}
          aria-label={text.toDate}
          {...dateAria}
          onChange={(event) => onChange('toDate', event.target.value)}
        />
      </label>
    </div>
  );
}
