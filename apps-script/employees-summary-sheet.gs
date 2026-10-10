// تبويب "Employees": ملخّص لكل موظف — موافق/مرفوض لكل نوع طلب،
// المجاميع، المعلّق، أيام الإجازة الموافق عليها، وآخر طلب.
//
// يُعاد بناؤه بالكامل كل مرة (مسح ثم إعادة كتابة)، لا تحديث جزئي —
// أبسط، وما يترك خلية قديمة ناسية لونها من جولة سابقة.
//
// يشتغل تلقائي بعد كل طلب جديد ينحفظ (submit-request-use-case.gs)،
// وتقدر تشغّله يدوي من محرّر Apps Script بعد ما تعدّل عمود Status.

var EMPLOYEES_SHEET_NAME = 'Employees';
var HEADER_ROW_COUNT = 2;
var FROZEN_COLUMN_COUNT = 3; // Email, Name, Department

var COLOR_HEADER_BG = '#152F4C';   // كحلي FORM
var COLOR_HEADER_FONT = '#FFFFFF';
var COLOR_APPROVED_BG = '#E6F4EA';
var COLOR_APPROVED_FONT = '#1E7A46';
var COLOR_REJECTED_BG = '#FBEAEA';
var COLOR_REJECTED_FONT = '#B3261E';
var COLOR_PENDING_BG = '#FFF4D6';
var COLOR_PENDING_FONT = '#8A6100';
var COLOR_LEAVE_DAYS_BG = '#FCEBDD'; // تدرّج فاتح من برتقالي المشعل
var COLOR_LEAVE_DAYS_FONT = '#B75B1E';

// عمودان لكل نوع طلب (موافق/مرفوض) + ثلاثة أعمدة هوية + أربعة مجاميع.
function summaryColumnCount() {
  return 3 + getRequestTypes().length * 2 + 4;
}

function getOrCreateEmployeesSheet() {
  var spreadsheet = getRequestsSpreadsheet();
  var sheet = spreadsheet.getSheetByName(EMPLOYEES_SHEET_NAME);
  return sheet || spreadsheet.insertSheet(EMPLOYEES_SHEET_NAME);
}

// عمود الهوية (البريد) الوحيد اللي ما يتلوّن — الاسم والقسم بلون
// عادي، والباقي حسب نوعه. نبني قائمة أعمدة اللون هنا مرة وحدة عشان
// كتابة الرؤوس وكتابة الصفوف يتفقان على نفس الترتيب بالضبط.
function summaryColumnPlan() {
  var columns = [
    { header1: '', header2: 'Email' },
    { header1: '', header2: 'Name' },
    { header1: '', header2: 'Department' },
  ];

  getRequestTypes().forEach(function (type) {
    columns.push({ header1: type.nameEn, header2: '✓ Approved', kind: 'approved', typeId: type.id });
    columns.push({ header1: type.nameEn, header2: '✗ Rejected', kind: 'rejected', typeId: type.id });
  });

  columns.push({ header1: '', header2: 'Total ✓ Approved', kind: 'approved', bold: true });
  columns.push({ header1: '', header2: 'Total ✗ Rejected', kind: 'rejected', bold: true });
  columns.push({ header1: '', header2: 'Pending', kind: 'pending', bold: true });
  columns.push({ header1: '', header2: 'Leave days ✓', kind: 'leaveDays', bold: true });
  columns.push({ header1: '', header2: 'Last request' });

  return columns;
}

function writeEmployeesSheetHeaders(sheet, columns) {
  var headerRange = sheet.getRange(1, 1, HEADER_ROW_COUNT, columns.length);
  headerRange.setBackground(COLOR_HEADER_BG).setFontColor(COLOR_HEADER_FONT).setFontWeight('bold');

  columns.forEach(function (column, index) {
    var columnNumber = index + 1;

    // الأعمدة اللي ما تحمل عنوان مجموعة (الهوية والمجاميع) تدمج
    // صفّيها الاثنين بعمود واحد، فالعنوان يُكتب مرة وحدة بالصف الأول
    // بعد الدمج — عشان الدمج يمسح أي قيمة بغير خلية الرأس (الصف الأول).
    if (!column.header1) {
      sheet.getRange(1, columnNumber, HEADER_ROW_COUNT, 1).merge();
      sheet.getRange(1, columnNumber).setValue(column.header2);
    } else {
      sheet.getRange(1, columnNumber).setValue(column.header1);
      sheet.getRange(2, columnNumber).setValue(column.header2);
    }
  });

  // ندمج كل زوج (موافق/مرفوض) بعنوان النوع أفقياً بالصف الأول.
  var typeCount = getRequestTypes().length;
  for (var typeIndex = 0; typeIndex < typeCount; typeIndex++) {
    var firstColumn = 4 + typeIndex * 2;
    sheet.getRange(1, firstColumn, 1, 2).merge();
  }
}

function backgroundAndFontFor(kind) {
  if (kind === 'approved') return [COLOR_APPROVED_BG, COLOR_APPROVED_FONT];
  if (kind === 'rejected') return [COLOR_REJECTED_BG, COLOR_REJECTED_FONT];
  if (kind === 'pending') return [COLOR_PENDING_BG, COLOR_PENDING_FONT];
  if (kind === 'leaveDays') return [COLOR_LEAVE_DAYS_BG, COLOR_LEAVE_DAYS_FONT];
  return [null, null];
}

// قيمة خلية وحدة حسب عمودها وموظفها — يفصل "شنو نعرض" عن "وين نكتب".
function cellValueFor(column, summary) {
  if (column.typeId) {
    var counts = summary.perType[column.typeId];
    return column.kind === 'approved' ? counts.approved : counts.rejected;
  }
  if (column.header2 === 'Email') return summary.email;
  if (column.header2 === 'Name') return summary.name;
  if (column.header2 === 'Department') return summary.department;
  if (column.header2 === 'Total ✓ Approved') return totalApproved(summary);
  if (column.header2 === 'Total ✗ Rejected') return totalRejected(summary);
  if (column.header2 === 'Pending') return summary.pending;
  if (column.header2 === 'Leave days ✓') return summary.leaveDaysApproved;
  return formatDisplayDate(summary.lastRequestAt);
}

function writeEmployeeRow(sheet, rowNumber, columns, summary) {
  columns.forEach(function (column, index) {
    var cell = sheet.getRange(rowNumber, index + 1);
    cell.setValue(cellValueFor(column, summary));

    var colors = backgroundAndFontFor(column.kind);
    if (colors[0]) cell.setBackground(colors[0]).setFontColor(colors[1]);
    if (column.bold) cell.setFontWeight('bold');
  });
}

function clearEmployeesSheetBody(sheet, columnCount) {
  var lastRow = sheet.getLastRow();
  if (lastRow > HEADER_ROW_COUNT) {
    sheet.getRange(HEADER_ROW_COUNT + 1, 1, lastRow - HEADER_ROW_COUNT, columnCount).clear();
  }
}

// يعيد بناء تبويب "Employees" كامل من صفوف السجل الحالية.
function rebuildEmployeesSummary() {
  var sheet = getOrCreateEmployeesSheet();
  var columns = summaryColumnPlan();

  clearEmployeesSheetBody(sheet, columns.length);
  writeEmployeesSheetHeaders(sheet, columns);

  var summaries = buildEmployeeSummaries(readRequestRows());
  summaries.forEach(function (summary, index) {
    writeEmployeeRow(sheet, HEADER_ROW_COUNT + 1 + index, columns, summary);
  });

  sheet.setFrozenRows(HEADER_ROW_COUNT);
  sheet.setFrozenColumns(FROZEN_COLUMN_COUNT);
}
