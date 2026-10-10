// الفحص الأخير للطلب. الواجهة بعد تفحص، بس فحصها عشان راحة الموظف؛
// هذا هو الفحص اللي يحمي السجل، لأن الرابط يقبل أي طلب يوصله.
//
// ترجّع قائمة رسائل عربية — فاضية يعني الطلب سليم. الواجهة ما تعرض
// هالرسائل حرفي (ممكن لغتها إنجليزي)، ترجّع الموظف لأول سؤال ناقص،
// فالرسائل هني للمسؤول ولسجل الأخطاء.
//
// كل قاعدة بدالة لحالها: تنقرأ لحالها وتتعدل لحالها.
//
// أي شي تحتاجه القواعد من برّا (النطاقات المسموحة وتاريخ اليوم) يوصل
// في rules من validation-rules، عشان هالملف ما يلمس ولا خدمة من جوجل:
// دوال صافية تتجرب بمناداتها بكائن تكتبه بيدك.

function validateRequest(request, rules) {
  return []
    .concat(validateEmployeeName(request))
    .concat(validateWorkEmail(request, rules))
    .concat(validatePhone(request))
    .concat(validateDepartment(request))
    .concat(validateRequestType(request))
    .concat(validateDetails(request))
    .concat(validateDates(request, rules))
    .concat(validateAttachment(request));
}

// الاسم: اسمين ع الأقل، مثل ما هو بالسجل الوظيفي.
function validateEmployeeName(request) {
  if (!request.employeeName) return ['الاسم الكامل مطلوب'];
  if (request.employeeName.split(/\s+/).length < 2) return ['اكتب الاسم الكامل (اسمين على الأقل)'];
  return [];
}

// البريد: هوية الموظف، وما نقبل إلا بريد العمل.
function validateWorkEmail(request, rules) {
  if (!request.workEmail) return ['بريد العمل مطلوب'];
  if (!isValidEmailShape(request.workEmail)) return ['صيغة البريد الإلكتروني غير صحيحة'];
  if (!isCompanyEmail(request.workEmail, rules.allowedEmailDomains)) {
    return ['البريد يجب أن يكون بريد عمل رسمياً'];
  }
  return [];
}

// الهاتف: ثمان خانات وتبدأ بـ 4 أو 5 أو 6 أو 9 (أرقام الكويت).
function validatePhone(request) {
  if (!request.phone) return ['رقم الهاتف مطلوب'];
  if (!/^[4569][0-9]{7}$/.test(request.phone)) return ['رقم الهاتف غير صحيح'];
  return [];
}

// القسم: من القائمة المعتمدة بس، عشان ما يدش السجل قسم مو موجود.
function validateDepartment(request) {
  if (!request.department) return ['القسم مطلوب'];
  if (!isKnownDepartmentName(request.department)) return ['القسم غير معروف'];
  return [];
}

function validateRequestType(request) {
  if (!request.type) return ['نوع الطلب مطلوب'];
  if (!findRequestTypeById(request.type)) return ['نوع الطلب غير معروف'];
  return [];
}

function validateDetails(request) {
  if (!request.details) return ['تفاصيل الطلب مطلوبة'];
  return [];
}

// التواريخ لطلب الإجازة بس: صيغة صحيحة، ولا يوم راح، والنهاية بعد
// البداية. باقي الأنواع ترسل تواريخ فاضية أصلاً.
function validateDates(request, rules) {
  var type = findRequestTypeById(request.type);
  if (!type || !type.needsDates) return [];

  if (!request.fromDate || !request.toDate) return ['تاريخ البداية والنهاية مطلوبان'];
  if (!isIsoDate(request.fromDate) || !isIsoDate(request.toDate)) return ['صيغة التاريخ غير صحيحة'];
  if (request.fromDate < rules.today) return ['لا يمكن اختيار تاريخ مضى'];
  if (request.toDate < request.fromDate) return ['تاريخ النهاية يجب أن يكون بعد تاريخ البداية'];
  return [];
}

// المرفق للطلب المرضي بس: نتأكد هني إنه موجود، وفحص محتواه (إنه PDF
// أصلي وحجمه مقبول) يصير وقت حفظه في Drive.
function validateAttachment(request) {
  var type = findRequestTypeById(request.type);
  if (!type || !type.needsPdf) return [];
  if (!request.pdfFile) return ['التقرير الطبي (PDF) مطلوب'];
  return [];
}

function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}
