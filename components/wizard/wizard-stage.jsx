// محتوى الشاشة: إما شاشة النجاح بعد الإرسال، أو السؤال الحالي مع
// رسالة فشل الإرسال وصف الأزرار. عرض بس — كل القرارات في الهوكس.
//
// ياخذ كائنات الهوكس مثل ما هي (nav، submission، attachment) بدل ما
// نفكّها ونعيد تركيبها بالويزرد — أقصر وأقل عرضة للخطأ لمن نضيف حقل.

import QuestionScreen from './question-screen';
import SuccessScreen from './success-screen';
import WizardActions from './wizard-actions';

export default function WizardStage({ nav, submission, attachment, form, text, locale }) {
  if (submission.isDone) {
    return (
      <SuccessScreen
        text={text}
        requestId={submission.requestId}
        onNewRequest={submission.startNewRequest}
      />
    );
  }

  return (
    <>
      <QuestionScreen
        screen={nav.current}
        text={text}
        locale={locale}
        form={form}
        error={nav.error}
        onChange={nav.updateField}
        onSelectType={nav.selectType}
        onSelectProfile={nav.selectProfile}
        onPickPdf={attachment.pickPdf}
        onRemovePdf={attachment.removePdf}
      />

      {submission.submitError && <p className="form-error">{submission.submitError}</p>}

      <WizardActions
        text={text}
        isReview={nav.isReview}
        isSubmitting={submission.isSubmitting}
        canGoBack={nav.index > 0}
        onNext={nav.goNext}
        onBack={nav.goBack}
        onSubmit={submission.submit}
      />
    </>
  );
}
