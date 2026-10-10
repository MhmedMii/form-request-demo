import RequestTypeCards from '../request-type-cards';
import ReviewSummary from '../step-review';
import AnswerProfile from './answer-profile';
import AnswerScenario from './answer-scenario';
import AnswerDates from './answer-dates';
import AnswerPdf from './answer-pdf';
const RENDERER_BY_KIND = {
  profile: (props) => <AnswerProfile {...props} />,
  scenario: (props) => <AnswerScenario {...props} />,
  type: ({ form, locale, onSelectType }) => (
    <RequestTypeCards locale={locale} selectedType={form.type} onSelect={onSelectType} />
  ),
  dates: (props) => <AnswerDates {...props} />,
  pdf: (props) => <AnswerPdf {...props} />,
  review: ({ text, locale, form }) => <ReviewSummary text={text} locale={locale} form={form} />,
};
export default function AnswerField(props) {
  return RENDERER_BY_KIND[props.screen.kind]?.(props) || null;
}
