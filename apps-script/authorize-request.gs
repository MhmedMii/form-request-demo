// الباب الوحيد للسيرفر: كلمة سر مشتركة بين مسار الموقع وهذا السكربت.
// رابط النشر (exec) مكشوف بطبيعته لأي أحد يعرفه، فالكلمة هي اللي
// تفصل بين طلب صادر من نموذجنا وطلب صادر من أي مكان آخر.
//
// المقارنة تمشي على كل الحروف دايماً (لا تخرج عند أول اختلاف) عشان ما
// يُستدلّ على الكلمة من فروق زمن الرد.

function isAuthorizedRequest(incomingSecret) {
  var expected = getSharedSecret();

  // كلمة سر غير مضبوطة تعني خدمة غير مهيّأة — نرفض ولا نفتح الباب.
  if (!expected) return false;

  return areStringsEqualInConstantTime(String(incomingSecret || ''), expected);
}

function areStringsEqualInConstantTime(given, expected) {
  if (given.length !== expected.length) return false;

  var difference = 0;
  for (var index = 0; index < expected.length; index++) {
    difference |= given.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return difference === 0;
}
