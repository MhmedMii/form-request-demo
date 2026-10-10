// شكل الرد الوحيد للسيرفر: نص JSON. مسار الموقع يقرأ الرد بـ
// response.json()، فأي رد بصيغة ثانية (صفحة HTML مثلاً) يصل الموظف
// كعطل غامض. تغليف الردود في مكان واحد يمنع هذا.
//
// الحالة دايماً 200: Apps Script يردّ على الأخطاء بصفحة HTML لا
// بـ JSON، فنحمل نتيجة العملية في الحقل ok داخل الجسم بدل رمز الحالة.

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
