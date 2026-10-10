// الوصلة بين قواعد التحقّق والعالم الخارجي. القواعد نفسها
// (validate-request) تحتاج معطيين لا تملكهما: نطاقات بريد العمل
// المسموحة، وتاريخ اليوم. لو قرأتهما بنفسها لاعتمدت على
// PropertiesService وSession، فما عادت تنقرأ ولا تتجرب بروحها.
//
// هذا الملف يجمعهما مرة وحدة ويسلّمهما، فتبقى القواعد دوالّ صافية:
// نفس المدخلات تعطي النتيجة نفسها دايماً.

function currentValidationRules() {
  return {
    allowedEmailDomains: getAllowedEmailDomains(),
    today: todayIsoInScriptTimezone(),
  };
}
