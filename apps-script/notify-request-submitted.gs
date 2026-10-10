// إرسال إشعارات الطلب: نسخة للموارد البشرية وتقنية المعلومات، ونسخة
// للموظف نفسه. النصوص تأتي جاهزة من request-email، وهذا الملف يوصلها.
//
// قاعدة هذا الملف: لا يرمي خطأ أبداً. الطلب صار محفوظاً في السجل قبل
// أن نصل إلى هنا، ففشل البريد (حصة انتهت، عنوان غلط) يُسجَّل للمسؤول
// ولا يُظهر للموظف فشلاً في طلبٍ نجح فعلاً.

function notifyRequestSubmitted(request, requestId, attachmentUrl) {
  sendStaffNotification(request, requestId, attachmentUrl);
  sendEmployeeCopy(request, requestId, attachmentUrl);
}

function sendStaffNotification(request, requestId, attachmentUrl) {
  var recipients = [getHrEmail(), getItEmail()]
    .filter(function (address) { return address !== ''; })
    .join(',');

  if (!recipients) {
    logFailure('sendStaffNotification', 'HR_EMAIL و IT_EMAIL غير مضبوطين');
    return;
  }

  sendHtmlEmail(
    recipients,
    buildStaffEmailSubject(request, requestId),
    buildStaffEmailBody(request, requestId, attachmentUrl)
  );
}

function sendEmployeeCopy(request, requestId, attachmentUrl) {
  sendHtmlEmail(
    request.workEmail,
    buildEmployeeEmailSubject(requestId),
    buildEmployeeEmailBody(request, requestId, attachmentUrl)
  );
}

// نقطة الإرسال الوحيدة — كل الرسائل تمرّ منها، فمكان معالجة الفشل واحد.
function sendHtmlEmail(recipients, subject, htmlBody) {
  try {
    MailApp.sendEmail({
      to: recipients,
      subject: subject,
      htmlBody: htmlBody,
      name: 'FORM',
    });
  } catch (problem) {
    logFailure('sendHtmlEmail', problem);
  }
}
