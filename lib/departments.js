export const departments = [
  { id: 'design', nameEn: 'Design', nameAr: 'التصميم' },
  { id: 'engineering', nameEn: 'Engineering', nameAr: 'الهندسة' },
  { id: 'people', nameEn: 'People operations', nameAr: 'شؤون الفريق' },
  { id: 'operations', nameEn: 'Operations', nameAr: 'العمليات' },
];
export function findDepartmentById(id) {
  return departments.find((dept) => dept.id === id) || null;
}
