// كل قراءة للوقت في السيرفر تمرّ من هنا. السبب: السكربت يعمل بتوقيت
// المشروع (الكويت غالباً) لمن التواريخ تصل من جهاز الموظف، فلو قرأ
// كل ملف الوقت بطريقته اختلف «اليوم» بين التحقّق والحد اليومي ورقم
// الطلب. مصدر واحد يمنع هذا الاختلاف.

function scriptTimezone() {
  return Session.getScriptTimeZone();
}

// تاريخ اليوم بصيغة YYYY-MM-DD — نفس صيغة التواريخ القادمة من النموذج،
// فتصحّ المقارنة النصية بينها مباشرة.
function todayIsoInScriptTimezone() {
  return Utilities.formatDate(new Date(), scriptTimezone(), 'yyyy-MM-dd');
}

// ختم زمني كامل لعمود الوقت في السجل.
function nowTimestampText() {
  return Utilities.formatDate(new Date(), scriptTimezone(), 'yyyy-MM-dd HH:mm:ss');
}

// مقطع التاريخ داخل رقم الطلب: NAV-20260806-0007
function todayCompactText() {
  return Utilities.formatDate(new Date(), scriptTimezone(), 'yyyyMMdd');
}

// تاريخ يُقرأ للعرض بالشيتات (تبويب Employees): 09/08/2026. ياخذ Date
// أو ختم زمني نصّي من السجل — القيمة فاضية ترجّع نص فاضي بدل خطأ.
function formatDisplayDate(value) {
  if (!value) return '';
  var date = value instanceof Date ? value : new Date(String(value).replace(' ', 'T'));
  if (isNaN(date.getTime())) return '';
  return Utilities.formatDate(date, scriptTimezone(), 'dd/MM/yyyy');
}
