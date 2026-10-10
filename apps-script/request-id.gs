// رقم الطلب اللي يراه الموظف على شاشة النجاح ويذكره لاحقاً للموارد
// البشرية: NAV-20260806-0007 — بادئة الشركة، بعدين اليوم، بعدين ترتيب الطلب
// داخل اليوم. مقروء ومنطوق، بعكس معرّف عشوائي طويل.
//
// الترتيب واليوم يصلان كوسيطين ولا يُقرآن هنا: بناء الرقم صياغة
// نصّية، وقراءة السجل عمل السيرفر. الفصل يجعل الصياغة تتجرب برقم
// تكتبه، ويُبقي القرار الحسّاس — متى ينقرأ العدّ — ظاهراً في حالة
// الاستخدام داخل القفل، فلا يأخذ طلبان متزامنان الرقم نفسه.

var REQUEST_ID_PREFIX = 'NAV';
var REQUEST_ID_SEQUENCE_DIGITS = 4;

function buildRequestId(todayText, sequence) {
  return [
    REQUEST_ID_PREFIX,
    todayText,
    padWithZeros(sequence, REQUEST_ID_SEQUENCE_DIGITS),
  ].join('-');
}

function padWithZeros(number, digits) {
  var text = String(number);
  while (text.length < digits) text = '0' + text;
  return text;
}
