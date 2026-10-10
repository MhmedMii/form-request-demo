// فحص بريد العمل على السيرفر. الواجهة تفحص النطاق أيضاً، لكن فحصها
// للطف الرسالة بس — هذا هو الفحص اللي نعتمد عليه، لأن أي أحد يقدر
// يرسل للرابط مباشرة بدون فتح النموذج.
//
// قائمة النطاقات تصل كوسيط، ولا تنقرأ من الإعدادات هنا: الفحص قاعدة
// صافية، ومن يعرف مصدر النطاقات هو validation-rules. چذي تتجرب
// الدالة بقائمة تكتبها بيدك، بلا خصائص سكربت ولا نشر.

var EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmailShape(email) {
  return EMAIL_SHAPE.test(String(email || '').trim());
}

// نقبل النطاق نفسه أو أي نطاق فرعي تحته (mail.example.com مثلاً).
function isCompanyEmail(email, allowedDomains) {
  var address = String(email || '').trim().toLowerCase();

  return allowedDomains.some(function (domain) {
    return endsWithText(address, '@' + domain) || endsWithText(address, '.' + domain);
  });
}

function endsWithText(text, ending) {
  return text.length >= ending.length
    && text.lastIndexOf(ending) === text.length - ending.length;
}
