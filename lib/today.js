// ترجّع تاريخ اليوم بصيغة YYYY-MM-DD حسب توقيت جهاز الموظف. نستخدمه
// كأقل قيمة (min) لخانات التاريخ عشان ما يقدر يختار يوم فات، وفي
// التحقق قبل الإرسال. نبنيه من مكوّنات التاريخ المحلية بدل toISOString
// عشان ما ينزلق ليوم قبل عند اختلاف المنطقة الزمنية عن UTC.
export function todayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
