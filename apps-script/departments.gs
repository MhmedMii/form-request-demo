// Fictional department catalog matching the public demo.
function getDepartments() { return [
  { id: 'design', nameEn: 'Design', nameAr: 'التصميم' },
  { id: 'engineering', nameEn: 'Engineering', nameAr: 'الهندسة' },
  { id: 'people', nameEn: 'People operations', nameAr: 'شؤون الفريق' },
  { id: 'operations', nameEn: 'Operations', nameAr: 'العمليات' }
]; }
function isKnownDepartmentName(name) { return getDepartments().some(function(department) { return department.nameEn === name; }); }
