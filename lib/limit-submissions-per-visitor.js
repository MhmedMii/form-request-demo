// تمنع نفس الجهاز يرسل أكثر من خمس طلبات خلال عشر دقائق. نخزّن
// أوقات الإرسال باعشان چذيكرة حسب عنوان الشبكة، ونشيل القديم تلقائياً.
// ملاحظة صريحة: فيرسل يشغّل أكثر من نسخة، وكل نسخة لها ذاكرتها،
// فهذا يخفّف الإغراق بس ما يمنعه ١٠٠٪ — الحد اليومي في السيرفر
// (Apps Script) هو خط الدفاع الثاني.
//
// نعدّ الطلبات الناجحة بس. المحاولة اللي ترجع خطأ — بريد مو مقبول،
// إجابة ناقصة، أو عطل عندنا — ما تاكل من حصة الموظف: هي ما أنشأت صفاً
// ولا أرسلت إيميلاً، والموظف اللي يصحّح خطأه خمس مرات ما يستاهل
// يتقفل عشر دقائق.

const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const recentSubmissions = new Map();

function submissionsInWindow(visitorKey) {
  const now = Date.now();
  return (recentSubmissions.get(visitorKey) || []).filter((moment) => now - moment < WINDOW_MS);
}

// قراءة بس: هل يُسمح لهذا الجهاز يحاول الحين؟
export function isVisitorAllowedToSubmit(visitorKey) {
  const previous = submissionsInWindow(visitorKey);
  recentSubmissions.set(visitorKey, previous);
  return previous.length < MAX_SUBMISSIONS;
}

// نسجّل الطلب بعد ما ينجح فعلاً — هذا بروحه اللي يعدّ على الحصة.
export function recordVisitorSubmission(visitorKey) {
  const previous = submissionsInWindow(visitorKey);
  previous.push(Date.now());
  recentSubmissions.set(visitorKey, previous);
}
