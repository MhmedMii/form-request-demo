// سقف يومي لعدد الطلبات. الغرض منه حماية حصة البريد في حساب جوجل:
// كل طلب يرسل رسائل، وحصة الإرسال محدودة يومياً — لو أغرق أحدهم
// النموذج استُهلكت الحصة وتوقّف بريد الشركة كله، لا النموذج بروحه.
//
// حدّ الجهاز الواحد يعيش في الموقع (limit-submissions-per-visitor)،
// وهذا هو الحدّ الكلّي: خط الدفاع الثاني ومصدره السجل نفسه، فيصمد
// عشان لو أُعيد تشغيل السيرفر أو تعدّدت نسخه.

function isDailyLimitReached() {
  return countTodayRequests() >= getDailyRequestLimit();
}

function countTodayRequests() {
  return readTodayRequestRows().length;
}
