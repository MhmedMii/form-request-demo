// حارس التكرار: ضغطتان على زر الإرسال، أو شبكة بطيئة يعيد معها
// المتصفّح المحاولة، تصنعان طلبين متطابقين. نمنع الثاني عشان ما يصل
// صفّان للموارد البشرية عن حادثة واحدة.
//
// «متطابق» = نفس الموظف ونفس النوع ونفس التفاصيل خلال دقيقة. بعد
// الدقيقة نقبله: يمكن يكون الموظف يقصد طلباً ثانياً فعلاً.

var DUPLICATE_WINDOW_SECONDS = 60;

function isDuplicateRequest(request) {
  return readTodayRequestRows().some(function (record) {
    return isSameRequestContent(record, request)
      && isWithinDuplicateWindow(record.Timestamp);
  });
}

function isSameRequestContent(record, request) {
  return String(record.WorkEmail).toLowerCase() === request.workEmail
    && String(record.Type) === request.type
    && String(record.Details) === request.details;
}

function isWithinDuplicateWindow(timestampText) {
  var secondsPassed = secondsSince(timestampText);
  return secondsPassed !== null && secondsPassed < DUPLICATE_WINDOW_SECONDS;
}

// الفارق بالثواني بين الحين وختم زمني من السجل، أو null إذا تعذّرت
// قراءته — ختم غير مقروء ما يصير يُحسب تكراراً فيمنع طلباً صحيحاً.
function secondsSince(timestampText) {
  var moment = new Date(String(timestampText).replace(' ', 'T'));
  if (isNaN(moment.getTime())) return null;
  return (new Date().getTime() - moment.getTime()) / 1000;
}
