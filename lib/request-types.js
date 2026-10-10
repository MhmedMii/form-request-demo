export const requestTypes = [
  {
    id: 'sick',
    nameEn: 'Medical absence',
    nameAr: 'غياب طبي',
    descriptionEn: 'A sample absence with a supporting document',
    descriptionAr: 'غياب نموذجي مع مستند داعم',
    needsPdf: true,
    needsDates: false,
  },
  {
    id: 'late',
    nameEn: 'Late arrival',
    nameAr: 'تأخير الحضور',
    descriptionEn: 'Let the day start a little later',
    descriptionAr: 'لبداية متأخرة قليلاً ليوم العمل',
    needsPdf: false,
    needsDates: false,
  },
  {
    id: 'excuse',
    nameEn: 'Permission to leave',
    nameAr: 'استئذان',
    descriptionEn: 'A little time away during the workday',
    descriptionAr: 'بعض الوقت خارج العمل خلال اليوم',
    needsPdf: false,
    needsDates: false,
  },
  {
    id: 'emergency',
    nameEn: 'Emergency request',
    nameAr: 'طلب طارئ',
    descriptionEn: 'For a change of plans you couldn’t predict',
    descriptionAr: 'لتغيرات لم تكن متوقعة في خطط اليوم',
    needsPdf: false,
    needsDates: false,
  },
  {
    id: 'leave',
    nameEn: 'Time off',
    nameAr: 'إجازة',
    descriptionEn: 'Plan a break and choose your dates',
    descriptionAr: 'خطط لإجازة واختر تواريخك',
    needsPdf: false,
    needsDates: true,
  },
];
export function findRequestTypeById(id) {
  return requestTypes.find((type) => type.id === id) || null;
}
