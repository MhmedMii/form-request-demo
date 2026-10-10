// أنواع الطلبات كما يعرفها السيرفر. هالقائمة توأم للقائمة في
// الواجهة (lib/request-types.js) وما يصير تفترقا: الواجهة تعرض،
// والسيرفر يحكم. أي نوع جديد يُضاف في الملفين معاً.

function getRequestTypes() {
  return [
    { id: 'sick',      nameEn: 'Sick / Medical', nameAr: 'مرضي / طبي',   needsPdf: true,  needsDates: false },
    { id: 'late',      nameEn: 'Late Arrival',   nameAr: 'تأخير الحضور', needsPdf: false, needsDates: false },
    { id: 'excuse',    nameEn: 'Excuse',         nameAr: 'استئذان',      needsPdf: false, needsDates: false },
    { id: 'emergency', nameEn: 'Emergency',      nameAr: 'طارئ',         needsPdf: false, needsDates: false },
    { id: 'leave',     nameEn: 'Leave Request',  nameAr: 'طلب إجازة',    needsPdf: false, needsDates: true  },
  ];
}

// يرجّع النوع حسب معرّفه، أو null إذا كان المعرّف مو معروف.
function findRequestTypeById(typeId) {
  var matches = getRequestTypes().filter(function (type) { return type.id === typeId; });
  return matches.length > 0 ? matches[0] : null;
}
