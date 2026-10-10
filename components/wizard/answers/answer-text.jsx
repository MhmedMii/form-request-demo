// إجابة نصية في سطر واحد (الاسم، البريد، الهاتف). تنظيف المكتوب
// يعيش هنا لإنه شأن هذا الحقل بروحه: الحقل الرقمي يرفض غير الأرقام
// ويقف عند حدّه أثناء الكتابة، فلا يصل السيرفر حرف غير رقمي أصلاً.

export default function AnswerText({ screen, value, fieldAria, onChange }) {
  function writeText(typed) {
    let clean = typed;
    if (screen.digitsOnly) clean = clean.replace(/\D/g, '');
    if (screen.maxLength) clean = clean.slice(0, screen.maxLength);
    onChange(screen.id, clean);
  }

  return (
    <input
      className="answer-input"
      name={screen.id}
      {...fieldAria}
      type={screen.inputType || 'text'}
      inputMode={screen.digitsOnly ? 'numeric' : undefined}
      placeholder={screen.placeholder}
      value={value}
      onChange={(event) => writeText(event.target.value)}
      autoFocus
    />
  );
}
