// معالجة نقرة الموافقة/الرفض من بريد الموارد البشرية. رابط بلا
// تسجيل دخول ولا جلسة، فالتوكن الموقّع (request-decision-token.gs)
// هو الحماية الوحيدة. تثبيت الحالة على Pending قبل الكتابة يمنع
// نقرة مكررة — فتح الرابط مرتين، أو من شخصين مختلفين — من الكتابة
// فوق قرار سابق بصمت.

function decideRequestFromLink(e) {
  var requestId = String((e && e.parameter && e.parameter.id) || '');
  var action = String((e && e.parameter && e.parameter.action) || '');
  var token = String((e && e.parameter && e.parameter.token) || '');

  var newStatus = action === 'approve' ? STATUS_APPROVED
    : action === 'reject' ? STATUS_REJECTED
    : '';

  if (!requestId || !newStatus) {
    return decisionPage('رابط غير صالح', 'الرابط ناقص أو غير مفهوم.');
  }
  if (!isValidDecisionToken(requestId, action, token)) {
    return decisionPage('رابط غير صالح', 'التوقيع لا يطابق — الرابط قد يكون معدَّلاً.');
  }

  var result = withScriptLock(function () {
    return applyRequestDecision(requestId, newStatus);
  });

  // busy يرجع من withScriptLock نفسه ككائن عادي، لا صفحة — نحوّله هنا.
  return (result && result.error === 'busy')
    ? decisionPage('السيرفر مشغول', 'حاول فتح الرابط بعد لحظات.')
    : result;
}

function applyRequestDecision(requestId, newStatus) {
  var found = findRequestRowById(requestId);
  if (!found) {
    return decisionPage('لم يُعثر على الطلب', 'رقم الطلب ' + requestId + ' غير موجود في السجل.');
  }

  if (found.record.Status !== STATUS_PENDING) {
    return decisionPage('قرار سابق', 'هذا الطلب مقرَّر أصلاً بحالة: ' + found.record.Status + '.');
  }

  writeRequestStatus(found.rowNumber, newStatus);
  rebuildEmployeesSummary();
  sendDecisionEmail(found.record, requestId, newStatus);

  var label = newStatus === STATUS_APPROVED ? 'تمت الموافقة' : 'تم الرفض';
  return decisionPage(label, 'تم تسجيل القرار وإشعار الموظف على بريده.');
}

function sendDecisionEmail(record, requestId, status) {
  sendHtmlEmail(
    record.WorkEmail,
    buildDecisionEmailSubject(requestId, status),
    buildDecisionEmailBody(record, requestId, status)
  );
}
