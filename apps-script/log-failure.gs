// تسجيل الأعطال. الموظف لا يرى تفاصيل العطل أبداً (قد تحمل روابط أو
// بيانات)، فهذا هو المكان الوحيد اللي تبقى فيه القصة كاملة للمسؤول
// في سجلّ التنفيذ (Executions) داخل محرّر Apps Script.

function logFailure(where, problem) {
  console.error('[form-or-request] ' + where + ': ' + describeProblem(problem));
}

function describeProblem(problem) {
  if (!problem) return 'سبب غير معروف';
  if (typeof problem === 'string') return problem;
  return problem.stack || problem.message || String(problem);
}
