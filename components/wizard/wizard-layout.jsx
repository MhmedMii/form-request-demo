import TopBar from '@/components/ui/top-bar';
import ProgressRail from '@/components/ui/progress-rail';
import BrandFooter from '@/components/ui/brand-footer';
import RequestContext from './request-context';
export default function WizardLayout({ rail, topBar, context, text, onKeyDown, children }) {
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
      <div className="journey-bar">
        <ProgressRail {...rail} text={text} />
        <div
          className="step-toolbar"
          role="progressbar"
          aria-label={text.progressLabel}
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span>{text.questionLabel}</span>
          <strong dir="ltr">{topBar.counter || text.completeLabel}</strong>
        </div>
      </div>
      <div className="workspace">
        <main className="stage" id="request-form">
          {children}
        </main>
        <RequestContext text={text} {...context} />
      </div>
      <BrandFooter text={text} />
    </div>
  );
}
