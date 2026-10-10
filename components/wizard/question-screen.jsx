import { useEffect, useRef } from 'react';
import AnswerField from './answers/answer-field';
import { useFocusOnError } from './hooks/use-focus-on-error';
export default function QuestionScreen({
  screen,
  text,
  locale,
  form,
  error,
  onChange,
  onSelectType,
  onSelectProfile,
  onPickPdf,
  onRemovePdf,
}) {
  const questionId = 'question-' + screen.id;
  const errorId = 'error-' + screen.id;
  const title = useRef(null);
  const answerRef = useFocusOnError(error);
  useEffect(() => {
    title.current?.focus({ preventScroll: true });
  }, [screen.id]);
  const fieldAria = {
    'aria-labelledby': questionId,
    'aria-describedby': error ? errorId : undefined,
    'aria-invalid': error ? true : undefined,
  };
  return (
    <div className="question">
      <p className="question-kicker">{screen.chip}</p>
      <h1 className="question-title" id={questionId} ref={title} tabIndex={-1}>
        {screen.question}
      </h1>
      <p className="question-hint">{screen.hint}</p>
      <div className="answer" ref={answerRef}>
        <AnswerField
          screen={screen}
          text={text}
          locale={locale}
          form={form}
          fieldAria={fieldAria}
          errorId={errorId}
          hasError={Boolean(error)}
          onChange={onChange}
          onSelectType={onSelectType}
          onSelectProfile={onSelectProfile}
          onPickPdf={onPickPdf}
          onRemovePdf={onRemovePdf}
        />
        {error && (
          <p className="error-text" id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
