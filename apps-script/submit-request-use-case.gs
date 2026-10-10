// حالة الاستخدام الوحيدة في السيرفر: «موظّف يقدّم طلباً». هذا الملف
// يرتّب الخطوات ولا ينفّذ أياً منها بنفسه — كل خطوة لها ملف ودالة
// خاصة. قراءة هالدالة بروحها تكفي لفهم رحلة الطلب كاملة.
//
// ترتيب الخطوات مقصود: الأرخص والأكثر رفضاً أول شي (كلمة السر، ثم
// التحقق) قبل أي كتابة في Drive أو Sheet أو إرسال بريد.

function submitRequestUseCase(body) {
  if (!isAuthorizedRequest(body.secret)) {
    return { ok: false, error: 'unauthorized' };
  }

  var request = normalizeRequest(body);

  var errors = validateRequest(request, currentValidationRules());
  if (errors.length > 0) {
    return { ok: false, errors: errors };
  }

  // ما بعد هذا السطر يقرأ السجل بعدين يكتب فيه، فيمشي داخل قفل واحد.
  try {
    return withScriptLock(function () {
      return saveRequestAndNotify(request);
    });
  } catch (problem) {
    logFailure('submitRequestUseCase', problem);
    return { ok: false, error: 'server_error' };
  }
}

// الجزء المحمي بالقفل: الفحوص اللي تقرأ السجل، بعدين الكتابة فيه.
function saveRequestAndNotify(request) {
  if (isDuplicateRequest(request)) {
    return { ok: false, error: 'duplicate' };
  }

  if (isDailyLimitReached()) {
    return { ok: false, error: 'daily_limit_reached' };
  }

  var attachmentUrl = '';
  if (request.pdfFile) {
    var attachment = savePdfToDrive(request.pdfFile, request.employeeName);
    if (!attachment.ok) return { ok: false, error: 'bad_pdf' };
    attachmentUrl = attachment.url;
  }

  // العدّ ينقرأ هنا داخل القفل، بعدين تصوغ الدالة الصافية الرقم منه.
  var requestId = buildRequestId(todayCompactText(), countTodayRequests() + 1);
  appendRequestRow(request, requestId, attachmentUrl);
  // يعيد بناء تبويب "Employees" بأرقام الطلب الجديد، عشان يبقى محدّث
  // بلا ما ينتظر المسؤول يشغّله بيده.
  rebuildEmployeesSummary();

  // البريد آخر خطوة عن قصد: الطلب محفوظ أصلاً، وفشل الإرسال (حصة
  // مستهلكة مثلاً) ما يصير يخسر الموظف طلبه بعد نجاحه.
  notifyRequestSubmitted(request, requestId, attachmentUrl);

  return { ok: true, requestId: requestId };
}
