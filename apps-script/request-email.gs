// نصوص رسائل البريد. لا إرسال هنا ولا قراءة إعدادات — بناء نصوص
// بس، فتنقرأ الصياغة وتتعدل بلا خوف من كسر منطق الإرسال، ويمكن
// تجربتها بمناداتها بروحها من محرّر Apps Script.

// عنوان الرسالة الواصلة للموارد البشرية وتقنية المعلومات.
function buildStaffEmailSubject(request, requestId) {
  return '[' + requestId + '] ' + requestTypeNameAr(request.type) + ' — ' + request.employeeName;
}

// عنوان النسخة اللي تصل الموظف نفسه.
function buildEmployeeEmailSubject(requestId) {
  return 'استلمنا طلبك — ' + requestId;
}

// جسم رسالة الموظفين: كل ما يحتاجه المسؤول ليقرّر، وزرّا موافقة/رفض
// أسفلها — نقرة وحدة تكفي لتسجيل القرار بلا فتح الشيت.
function buildStaffEmailBody(request, requestId, attachmentUrl) {
  return wrapEmailHtml(
    'طلب جديد',
    buildRequestRows(request, requestId, attachmentUrl),
    'وصلك هذا الطلب من نموذج الطلبات الداخلي.',
    buildDecisionLinksHtml(requestId)
  );
}

// جسم رسالة الموظف: طمأنة ورقم الطلب وملخّص ما أرسله.
function buildEmployeeEmailBody(request, requestId, attachmentUrl) {
  return wrapEmailHtml(
    'استلمنا طلبك',
    buildRequestRows(request, requestId, attachmentUrl),
    'هذه نسخة لك من طلبك. سيصلك قرار الموافقة على هذا البريد.'
  );
}

// عنوان وجسم رسالة القرار اللي تصل الموظف بعد موافقة/رفض المسؤول.
function buildDecisionEmailSubject(requestId, status) {
  var label = status === STATUS_APPROVED ? 'تمت الموافقة على طلبك' : 'تم رفض طلبك';
  return label + ' — ' + requestId;
}

function buildDecisionEmailBody(record, requestId, status) {
  var label = status === STATUS_APPROVED ? 'تمت الموافقة على طلبك' : 'تم رفض طلبك';
  var rows = [
    ['رقم الطلب', requestId],
    ['النوع', requestTypeNameAr(record.Type)],
    ['الحالة', label],
  ];
  return wrapEmailHtml(label, rows, 'هذا تحديث حالة طلبك.');
}

// زرّا الموافقة والرفض داخل رسالة الموارد البشرية. الرابط يذهب لنفس
// نشر السكربت (exec) بمعاملات id/action/token، والتوكن يمنع أي نقر
// من غير هذه الرسالة تحديداً (request-decision-token.gs).
function buildDecisionLinksHtml(requestId) {
  var baseUrl = ScriptApp.getService().getUrl();
  var approveUrl = baseUrl + '?id=' + encodeURIComponent(requestId) + '&action=approve&token=' + buildDecisionToken(requestId, 'approve');
  var rejectUrl = baseUrl + '?id=' + encodeURIComponent(requestId) + '&action=reject&token=' + buildDecisionToken(requestId, 'reject');

  return '<div style="padding:4px 20px 20px;text-align:center">'
    + '<a href="' + approveUrl + '" style="display:inline-block;margin:0 6px;padding:10px 22px;border-radius:8px;background:#1E7A46;color:#ffffff;text-decoration:none;font-weight:bold">موافقة</a>'
    + '<a href="' + rejectUrl + '" style="display:inline-block;margin:0 6px;padding:10px 22px;border-radius:8px;background:#B3261E;color:#ffffff;text-decoration:none;font-weight:bold">رفض</a>'
    + '</div>';
}

// صفوف الملخّص المشتركة بين الرساللين.
function buildRequestRows(request, requestId, attachmentUrl) {
  var type = findRequestTypeById(request.type);

  var rows = [
    ['رقم الطلب', requestId],
    ['الاسم', request.employeeName],
    ['القسم', request.department],
    ['النوع', requestTypeNameAr(request.type)],
    ['بريد العمل', request.workEmail],
    ['الهاتف', request.phone],
  ];

  if (type && type.needsDates) {
    rows.push(['المدة', request.fromDate + ' ← ' + request.toDate]);
  }
  rows.push(['التفاصيل', request.details]);

  if (attachmentUrl) {
    rows.push(['المرفق', '<a href="' + attachmentUrl + '">فتح التقرير الطبي</a>']);
  }
  return rows;
}

function requestTypeNameAr(typeId) {
  var type = findRequestTypeById(typeId);
  return type ? type.nameAr : typeId;
}

// قالب واحد للرساللين: عنوان، سطر تمهيد، بعدين جدول الصفوف. عربي/يمين
// لموار بألوان الهوية (كحلي FORM وبرتقالي المشعل).
function wrapEmailHtml(title, rows, intro, actionsHtml) {
  var tableRows = rows.map(buildEmailRowHtml).join('');

  return '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;background:#f1ece3;padding:24px">'
    + '<div style="max-width:560px;margin:auto;background:#ffffff;border-radius:14px;overflow:hidden">'
    + '<div style="background:#152F4C;color:#ffffff;padding:18px 20px;font-size:18px">' + title + '</div>'
    + '<p style="padding:16px 20px 0;margin:0;color:#63747f;font-size:14px">' + intro + '</p>'
    + '<table style="width:100%;border-collapse:collapse;font-size:14px;margin:12px 0 20px">' + tableRows + '</table>'
    + (actionsHtml || '')
    + '<div style="height:4px;background:#D96F22"></div>'
    + '</div></div>';
}

function buildEmailRowHtml(row) {
  return '<tr>'
    + '<td style="padding:8px 12px;color:#63747f;white-space:nowrap;vertical-align:top">' + row[0] + '</td>'
    + '<td style="padding:8px 12px;color:#17222e">' + toSafeEmailValue(row[1]) + '</td>'
    + '</tr>';
}

// نصوص الموظف قد تحوي < أو & أو أسطراً جديدة، فنهرّبها عشان ما تكسر
// شكل الرسالة. رابط المرفق نبنيه نحن، فيمرّ مثل ما هو.
function toSafeEmailValue(value) {
  var text = String(value);
  if (text.indexOf('<a href="') === 0) return text;

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}
