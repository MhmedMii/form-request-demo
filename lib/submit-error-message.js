// يترجم رد السيرفر إلى رسالة يفهمها الموظف. كل سبب له رسالة منفصلة
// عشان المسؤول يعرف من الرسالة وين المشكلة بالضبط، بدل رسالة عامة
// ما تدل ع شي.
//
// دالة صافية: تاخذ الرد والنصوص، وترجّع نص. ما تلمس حالة ولا شبكة.

const MESSAGE_KEY_BY_ERROR = {
  duplicate: 'errorDuplicate',
  // الإعدادات ناقصة أو الرابط غلط ع السيرفر.
  not_configured: 'errorConfig',
  // كلمة السر ما تطابق المحفوظة في Apps Script.
  unauthorized: 'errorAuth',
  // إرسال متكرر من نفس الجهاز خلال عشر دقايق.
  too_many: 'errorTooMany',
  // النظام وصل حده اليومي (حماية حصة الإيميلات).
  daily_limit_reached: 'errorDailyLimit',
  // المرفق ما عدّى فحص السيرفر (مو PDF أصلي أو أكبر من عشر ميجا).
  bad_pdf: 'errorPdfRejected',
};

export function messageForSubmitError(result, text) {
  const messageKey = MESSAGE_KEY_BY_ERROR[result.error];
  if (messageKey) return text[messageKey];

  // السيرفر يرجّع قائمة أخطاء تحقّق بالعربي دايماً، فما نعرضها كما هي —
  // نرجّع الموظف لأول سؤال ناقص برسالة بلغته هو.
  if (Array.isArray(result.errors) && result.errors.length > 0) {
    return text.errorCheckAnswers;
  }
  return text.errorGeneric;
}
