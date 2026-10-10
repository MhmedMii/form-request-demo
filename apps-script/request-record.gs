// شكل الطلب داخل السيرفر. كل ما يصل من الشبكة يمرّ من هنا أول شي،
// فيخرج كائناً واحداً معروف الحقول: نصوص مشذّبة بس، لا undefined ولا
// حقول زائدة. باقي الملفات تعتمد على هذا الشكل وما تلمس الجسم الخام.

// أسماء الحقول اللي نقبلها؛ أي شي آخر في الجسم يُهمل بصمت.
var REQUEST_FIELDS = [
  'type', 'employeeName', 'workEmail', 'phone',
  'department', 'details', 'fromDate', 'toDate',
];

function normalizeRequest(body) {
  var request = {};

  REQUEST_FIELDS.forEach(function (field) {
    request[field] = toTrimmedText(body[field]);
  });

  // البريد هوية الموظف في السجل، فنوحّده بحروف صغيرة مرة وحدة هنا.
  request.workEmail = request.workEmail.toLowerCase();

  // المرفق يبقى كما وصل (base64 خام) — تشذيبه يفسده.
  request.pdfFile = typeof body.pdfFile === 'string' ? body.pdfFile : '';

  return request;
}

function toTrimmedText(value) {
  return typeof value === 'string' ? value.trim() : '';
}
