// حفظ التقرير الطبي في Drive. يصل الملف نصاً base64 داخل الطلب،
// فنفكّه هنا ونتأكد إنه PDF حقيقي قبل حفظه — فحص المتصفّح يُخدع
// بتغيير الامتداد، أما بصمة الملف (%PDF-) فلا.
//
// نرجّع { ok, url } بدل رمي خطأ: فشل المرفق سببه بيانات المستخدم لا
// عطل في السيرفر، وحالة الاستخدام تترجمه إلى رسالة يفهمها الموظف.

var MAX_PDF_BYTES = 10 * 1024 * 1024;
var PDF_SIGNATURE = '%PDF-';

function savePdfToDrive(base64Content, employeeName) {
  var bytes = decodeBase64(base64Content);
  if (!bytes) return { ok: false, url: '' };
  if (bytes.length > MAX_PDF_BYTES) return { ok: false, url: '' };
  if (!looksLikePdf(bytes)) return { ok: false, url: '' };

  try {
    var file = getAttachmentsFolder().createFile(
      Utilities.newBlob(bytes, 'application/pdf', buildAttachmentName(employeeName))
    );
    return { ok: true, url: file.getUrl() };
  } catch (problem) {
    logFailure('savePdfToDrive', problem);
    return { ok: false, url: '' };
  }
}

// نصّ base64 مكسور يعني مرفقاً مرفوضاً، لا انهياراً في السيرفر.
function decodeBase64(base64Content) {
  try {
    return Utilities.base64Decode(base64Content);
  } catch (problem) {
    return null;
  }
}

// أول خمس بايتات في كل ملف PDF هي %PDF- — بصمة الصيغة نفسها.
function looksLikePdf(bytes) {
  if (bytes.length < PDF_SIGNATURE.length) return false;

  for (var index = 0; index < PDF_SIGNATURE.length; index++) {
    // بايتات Apps Script موقّعة (‎-128..127)، فنعيدها لمدى 0..255.
    if ((bytes[index] & 0xFF) !== PDF_SIGNATURE.charCodeAt(index)) return false;
  }
  return true;
}

// اسم يخبر عن صاحبه ووقته بلا فتحه: medical-Sara-Example-20260806174012.pdf
function buildAttachmentName(employeeName) {
  var safeName = String(employeeName)
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  var stamp = nowTimestampText().replace(/[^0-9]/g, '');
  return 'medical-' + (safeName || 'employee') + '-' + stamp + '.pdf';
}

// مجلّد المرفقات من الإعدادات؛ بدون معرّف نحفظ في جذر Drive الخاص
// بالحساب بدل أن يضيع المرفق أو يفشل الطلب كلّه.
function getAttachmentsFolder() {
  var folderId = getDriveFolderId();
  return folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
}
