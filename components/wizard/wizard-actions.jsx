import { ArrowRight, ArrowLeft, Check } from '@phosphor-icons/react';
export default function WizardActions({
  text,
  isReview,
  isSubmitting,
  canGoBack,
  onNext,
  onBack,
  onSubmit,
}) {
  return (
    <div className="question-actions">
      <button
        className="btn btn-primary"
        onClick={isReview ? onSubmit : onNext}
        disabled={isSubmitting}
      >
        {isReview ? (isSubmitting ? text.submitting : text.submit) : text.next}
        {isReview ? <Check size={17} /> : <ArrowRight size={17} className="directional" />}
      </button>
      {canGoBack && (
        <button className="btn btn-ghost" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft size={17} className="directional" />
          {text.back}
        </button>
      )}
      <span className="autosave">
        <span />
        {text.autosaveHint}
      </span>
    </div>
  );
}
