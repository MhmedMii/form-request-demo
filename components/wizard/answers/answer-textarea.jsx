// إجابة بعدة أسطر (تفاصيل الطلب). Enter هنا يكتب سطراً جديداً ولا
// ينقل للسؤال التالي — المعالج (RequestWizard) يستثني هذا الحقل.

export default function AnswerTextarea({ screen, value, fieldAria, onChange }) {
  return (
    <textarea
      className="answer-input answer-textarea"
      name={screen.id}
      {...fieldAria}
      rows={4}
      placeholder={screen.placeholder}
      value={value}
      onChange={(event) => onChange(screen.id, event.target.value)}
      autoFocus
    />
  );
}
