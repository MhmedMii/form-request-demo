import { Check } from '@phosphor-icons/react';
import { demoReasons } from '@/lib/demo-profiles';
export default function AnswerScenario({ form, locale, onChange, fieldAria, text }) {
  return (
    <div className="scenario-list" role="group" {...fieldAria}>
      {(demoReasons[form.type] || []).map((reason) => (
        <button
          key={reason.id}
          className={'scenario-card ' + (form.details === reason.id ? 'selected' : '')}
          aria-pressed={form.details === reason.id}
          onClick={() => onChange('details', reason.id)}
        >
          <span className="selection-circle">
            {form.details === reason.id && <Check size={13} />}
          </span>
          <span>{locale === 'ar' ? reason.ar : reason.en}</span>
        </button>
      ))}
      <p className="field-footnote">{text.scenarioFootnote}</p>
    </div>
  );
}
