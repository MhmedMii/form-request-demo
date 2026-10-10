// حساب صفوف تبويب "الموظفين": صف واحد لكل موظف فيه عدد الموافقات
// والرفض لكل نوع طلب، والمجاميع، والمعلّق، وأيام الإجازة الموافق
// عليها، وتاريخ آخر طلب.
//
// دوال صافية بالكامل — تاخذ صفوف السجل وترجّع أرقام، بلا أي قراءة
// أو كتابة لأي خدمة من جوجل. اللي يقرأ الشيت ويكتبه ملف ثاني
// (employees-summary-sheet.gs)، عشان نقدر نجرّب الحساب بروحه.

// نبني صف فاضي لموظف جديد: صفر لكل نوع، ونحتفظ باسمه وقسمه من أول
// طلب نشوفه له (يتحدّث لآخر قيمة لو تغيّرت لاحقاً).
function emptyEmployeeSummary(record) {
  var perType = {};
  getRequestTypes().forEach(function (type) {
    perType[type.id] = { approved: 0, rejected: 0 };
  });

  return {
    email: String(record.WorkEmail).toLowerCase(),
    name: record.EmployeeName,
    department: record.Department,
    perType: perType,
    pending: 0,
    leaveDaysApproved: 0,
    lastRequestAt: record.Timestamp,
  };
}

// يحدّث صف موظف وحد بأثر طلب وحد. ما يرجّع شي — يعدّل الكائن الممرّر
// له مباشرة، لأنه تجميع (accumulator) داخل حلقة، مو قيمة مستقلة.
function applyRecordToSummary(summary, record) {
  var type = String(record.Type);
  var status = String(record.Status);

  if (status === STATUS_APPROVED && summary.perType[type]) {
    summary.perType[type].approved += 1;
    if (type === 'leave') summary.leaveDaysApproved += daysBetweenIsoDates(record.FromDate, record.ToDate);
  } else if (status === STATUS_REJECTED && summary.perType[type]) {
    summary.perType[type].rejected += 1;
  } else if (status === STATUS_PENDING) {
    summary.pending += 1;
  }

  if (String(record.Timestamp) > String(summary.lastRequestAt)) {
    summary.lastRequestAt = record.Timestamp;
  }
}

// عدد الأيام بين تاريخين شامل الطرفين (من 10 إلى 14 = خمسة أيام).
// نضيف وقت UTC صريح عشان ما ينزلق التاريخ بفرق المنطقة الزمنية.
function daysBetweenIsoDates(fromIso, toIso) {
  var from = Date.parse(fromIso + 'T00:00:00Z');
  var to = Date.parse(toIso + 'T00:00:00Z');
  if (isNaN(from) || isNaN(to)) return 0;
  return Math.round((to - from) / (24 * 60 * 60 * 1000)) + 1;
}

function totalApproved(summary) {
  return getRequestTypes().reduce(function (sum, type) {
    return sum + summary.perType[type.id].approved;
  }, 0);
}

function totalRejected(summary) {
  return getRequestTypes().reduce(function (sum, type) {
    return sum + summary.perType[type.id].rejected;
  }, 0);
}

// يبني صف تجميعي لكل موظف من كل صفوف السجل، ويرتّبهم بالاسم.
function buildEmployeeSummaries(requestRecords) {
  var summaryByEmail = {};

  requestRecords.forEach(function (record) {
    var email = String(record.WorkEmail).toLowerCase();
    if (!summaryByEmail[email]) summaryByEmail[email] = emptyEmployeeSummary(record);
    applyRecordToSummary(summaryByEmail[email], record);
  });

  return Object.keys(summaryByEmail)
    .map(function (email) { return summaryByEmail[email]; })
    .sort(function (a, b) { return a.name.localeCompare(b.name); });
}
