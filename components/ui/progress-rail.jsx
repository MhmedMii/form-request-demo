import { Check } from '@phosphor-icons/react';
export default function ProgressRail({ screens, index, text }) {
  const stages = [
    { id: 'identify', label: text.stepIdentify },
    { id: 'request', label: text.stepRequest },
    { id: 'review', label: text.stepReview },
  ];
  const current =
    index >= screens.length ? 3 : stages.findIndex((stage) => stage.id === screens[index]?.stage);
  return (
    <nav aria-label={text.progressLabel}>
      <ol className="rail-steps">
        {stages.map((stage, position) => (
          <li
            key={stage.id}
            className={
              'rail-step ' + (position < current ? 'done' : position === current ? 'now' : '')
            }
            aria-current={position === current ? 'step' : undefined}
          >
            <span className="step-number" aria-hidden="true">
              {position < current ? <Check size={13} /> : position + 1}
            </span>
            <span>{stage.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
