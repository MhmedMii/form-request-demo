// قفل السكربت معزول هنا بروحه. الغرض: حالة الاستخدام تنقرأ كتسلسل
// خطوات، لا كخليط من waitLock وtry/finally حول المنطق الحقيقي.
//
// أي عمل يقرأ السجل بعدين يكتب فيه يمرّ من هنا: بدون القفل يقرأ طلبان
// متزامنان العدد نفسه، فيأخذان الرقم نفسه ويتجاوزان الحد اليومي معاً.

var LOCK_WAIT_MS = 30 * 1000;

// ينفّذ العمل داخل القفل ويرجّع نتيجته. لو تعذّر القفل نرجّع 'busy'
// بدل الانتظار للأبد، ولو رمى العمل خطأً نحرّر القفل بعدين يمرّ الخطأ.
function withScriptLock(action) {
  var lock = LockService.getScriptLock();

  try {
    lock.waitLock(LOCK_WAIT_MS);
  } catch (problem) {
    return { ok: false, error: 'busy' };
  }

  try {
    return action();
  } finally {
    lock.releaseLock();
  }
}
