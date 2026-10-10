import TopBar from '@/components/ui/top-bar';
import ProgressRail from '@/components/ui/progress-rail';
import BrandFooter from '@/components/ui/brand-footer';
export default function WizardLayout({ rail, topBar, text, onKeyDown, children }) {
  const percent = Math.min(
    100,
    Math.round((rail.index / Math.max(1, rail.screens.length - 1)) * 100),
  );
  return (
    <div className="screen" onKeyDown={onKeyDown}>
      <a className="skip-link" href="#request-form">
        {text.skipContent}
      </a>
      <TopBar text={text} {...topBar} />
      <div className="workspace">
        <ProgressRail {...rail} text={text} onReset={topBar.onReset} />
        <div className="column">
          <div className="step-toolbar">
            <span>
              {text.questionLabel} <strong dir="ltr">{topBar.counter || text.completeLabel}</strong>
            </span>
            <span>{rail.stageLabel}</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-label={text.progressLabel}
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: percent + '%' }} />
          </div>
          <main className="stage" id="request-form">
            {children}
          </main>
          <BrandFooter text={text} />
        </div>
      </div>
    </div>
  );
}
