// السجل: ورقة واحدة في Google Sheets فيها صف لكل طلب. هذا الملف هو
// المكان الوحيد اللي يعرف أسماء الأعمدة وترتيبها؛ باقي الكود يتعامل
// مع كائن الطلب بس. تغيير عمود يبدأ وينتهي هنا.

var REQUESTS_SHEET_NAME = 'Requests';

var REQUESTS_SHEET_HEADERS = [
  'Timestamp', 'RequestID', 'Type', 'EmployeeName', 'WorkEmail', 'Phone',
  'Department', 'Details', 'FromDate', 'ToDate', 'Attachment', 'Status',
];

// حالات الطلب. Pending تلقائية عند الوصول؛ الموافقة والرفض الموارد
// البشرية تكتبهم بنفسها بعمود Status — عليهم يبني تبويب "Employees".
var STATUS_PENDING = 'Pending';
var STATUS_APPROVED = 'Approved';
var STATUS_REJECTED = 'Rejected';

// عدد الصفوف اللي نطبّق عليها قائمة الحالات المنسدلة — سخي بما يكفي
// لسنوات من الطلبات، عشان الموارد البشرية ما تعلق بلا قائمة على صف جديد.
var STATUS_VALIDATION_ROW_COUNT = 2000;

// الجدول: السكربت المربوط بالملف يقرأه مباشرة، والسكربت المستقل
// يحتاج معرّف الملف في الإعدادات (SPREADSHEET_ID).
function getRequestsSpreadsheet() {
  var spreadsheetId = readSetting('SPREADSHEET_ID', '');
  return spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
}

// الورقة نفسها؛ تنبني برؤوسها إن لم تكن موجودة، فأول طلب ينجح على
// ملف جديد بلا تجهيز يدوي.
function getRequestsSheet() {
  var spreadsheet = getRequestsSpreadsheet();
  var sheet = spreadsheet.getSheetByName(REQUESTS_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(REQUESTS_SHEET_NAME);
    writeSheetHeaders(sheet);
  }
  return sheet;
}

function writeSheetHeaders(sheet) {
  sheet.getRange(1, 1, 1, REQUESTS_SHEET_HEADERS.length)
    .setValues([REQUESTS_SHEET_HEADERS])
    .setFontWeight('bold');
  sheet.setFrozenRows(1);
}

// يضيف صف الطلب. الترتيب يتبع REQUESTS_SHEET_HEADERS حرفاً بحرف.
function appendRequestRow(request, requestId, attachmentUrl) {
  getRequestsSheet().appendRow([
    nowTimestampText(),
    requestId,
    request.type,
    request.employeeName,
    request.workEmail,
    // الهاتف نصّاً عشان ما تبتلع الورقة الصفر الأول من الرقم.
    "'" + request.phone,
    request.department,
    request.details,
    request.fromDate,
    request.toDate,
    attachmentUrl,
    STATUS_PENDING,
  ]);
}

// كل الصفوف ككائنات مفاتيحها أسماء الأعمدة — أسهل قراءة من أرقام
// أعمدة متناثرة في الكود، وتبقى صحيحة لو تغيّر ترتيب الأعمدة.
function readRequestRows() {
  var values = getRequestsSheet().getDataRange().getValues();
  if (values.length < 2) return [];

  var headers = values[0];
  return values.slice(1).map(function (row) {
    var record = {};
    headers.forEach(function (header, column) {
      record[header] = row[column];
    });
    return record;
  });
}

// صفوف اليوم بس — يعتمد عليها الحد اليومي ورقم الطلب التسلسلي.
function readTodayRequestRows() {
  var today = todayIsoInScriptTimezone();
  return readRequestRows().filter(function (record) {
    return String(record.Timestamp).indexOf(today) === 0;
  });
}

// نجبر عمود Timestamp يكون نص صافي (تنسيق @)، مو تاريخ. بدونه، جوجل
// شيتس يحوّل النص اللي نكتبه ("2026-08-09 15:04:03") تلقائياً لقيمة
// تاريخ حقيقية — فلمّا نقارنه كنص بتاريخ اليوم بالفلترة، المقارنة ما
// تتطابق أبداً، وعدّ طلبات اليوم يطلع صفر دايماً مهما كان عدد الصفوف
// الحقيقي. هذا يفسّر رقم الطلب المكرّر اللي شفناه.
function ensureTimestampColumnIsPlainText(sheet) {
  var timestampColumn = REQUESTS_SHEET_HEADERS.indexOf('Timestamp') + 1;
  sheet.getRange(1, timestampColumn, STATUS_VALIDATION_ROW_COUNT, 1).setNumberFormat('@');
}

// قائمة منسدلة على عمود Status: Pending أو Approved أو Rejected بس —
// عشان كتابة خاطئة بالإيد (مثلاً "approved" بحروف صغيرة) ما تفوّت
// الطلب من حساب تبويب "Employees" بصمت. يُستدعى وقت التجهيز
// (setupScript)، وآمن يتكرر — يعيد نفس القائمة بلا ضرر.
// يبحث عن صف الطلب برقمه — يرجّع رقم الصف الحقيقي بالورقة (لأجل
// الكتابة لاحقاً) مع الصف كسجل، أو null إذا ما لقاه.
function findRequestRowById(requestId) {
  var values = getRequestsSheet().getDataRange().getValues();
  if (values.length < 2) return null;

  var headers = values[0];
  var idColumn = headers.indexOf('RequestID');

  for (var row = 1; row < values.length; row++) {
    if (String(values[row][idColumn]) === requestId) {
      var record = {};
      headers.forEach(function (header, column) { record[header] = values[row][column]; });
      return { rowNumber: row + 1, record: record };
    }
  }
  return null;
}

// يكتب حالة جديدة مباشرة بخلية Status لصف الطلب.
function writeRequestStatus(rowNumber, status) {
  var statusColumn = REQUESTS_SHEET_HEADERS.indexOf('Status') + 1;
  getRequestsSheet().getRange(rowNumber, statusColumn).setValue(status);
}

function applyStatusDropdownValidation() {
  var statusColumn = REQUESTS_SHEET_HEADERS.indexOf('Status') + 1;
  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList([STATUS_PENDING, STATUS_APPROVED, STATUS_REJECTED], true)
    .setAllowInvalid(false)
    .build();

  getRequestsSheet()
    .getRange(2, statusColumn, STATUS_VALIDATION_ROW_COUNT, 1)
    .setDataValidation(rule);
}
