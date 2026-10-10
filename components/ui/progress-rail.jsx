import { Check, ArrowUpRight } from '@phosphor-icons/react';
export default function ProgressRail({ screens, index, stageLabel, text, onReset }) {
  const stages = [
    { id: 'identify', label: text.stepIdentify, description: text.identifyDescription },
    { id: 'request', label: text.stepRequest, description: text.requestDescription },
    { id: 'review', label: text.stepReview, description: text.reviewDescription },
  ];
  const current =
    index >= screens.length ? 3 : stages.findIndex((stage) => stage.id === screens[index]?.stage);
  return (
    <aside className="rail">
      <div className="rail-intro">
        <span className="section-caption">{text.portalCaption}</span>
        <h2>{text.railTitle}</h2>
        <p>{text.railDescription}</p>
      </div>
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
              <span className="step-number">
                {position < current ? <Check size={15} /> : String(position + 1).padStart(2, '0')}
              </span>
              <span>
                <strong>{stage.label}</strong>
                <small>{stage.description}</small>
              </span>
            </li>
          ))}
        </ol>
      </nav>
      <div className="rail-demo-note">
        <span className="section-caption">{text.demoNoteTitle}</span>
        <p>{text.demoNote}</p>
        <button onClick={onReset}>
          {text.startOver}
          <ArrowUpRight size={16} />
        </button>
      </div>
    </aside>
  );
}
