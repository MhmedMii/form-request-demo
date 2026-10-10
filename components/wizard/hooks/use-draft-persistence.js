// حفظ المسوّدة واسترجاعها. الفايدة: مكالمة واردة أو تسكير التبويب ما
// يضيّع اللي كتبه الموظف.
//
// الترتيب هني حسّاس: ما نحفظ ولا مرة قبل ما نخلص الاسترجاع، وإلا كتبنا
// نموذج فاضي فوق المسوّدة المحفوظة وضاعت. لهذا نستخدم state مو ref —
// الـ ref يتغيّر ع طول والنموذج المسترجع ما وصل بعد.

import { useState, useEffect, useRef } from 'react';
import { saveDraft, readSavedDraft } from '@/lib/save-draft-in-session';

export function useDraftPersistence({ form, questionIndex, onRestore }) {
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // onRestore يتجدد كل رندر (تعريفه inline بالمكوّن الأب)، فلو حطيناه
  // بالـ deps الأسفل بيعيد تشغيل الاسترجاع كل مرة ويكسر شرط "مرة وحدة
  // بس". الـ ref يخلينا نستدعي آخر نسخة منه بدون ما نكسر هالشرط.
  const onRestoreRef = useRef(onRestore);
  onRestoreRef.current = onRestore;

  useEffect(() => {
    const draft = readSavedDraft();
    if (draft && draft.form) onRestoreRef.current(draft);
    setIsDraftRestored(true);
  }, []);

  useEffect(() => {
    if (isDraftRestored) saveDraft(form, questionIndex);
  }, [isDraftRestored, form, questionIndex]);
}
