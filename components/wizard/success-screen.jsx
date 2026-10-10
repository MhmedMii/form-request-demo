import { Check, ArrowRight, DownloadSimple } from '@phosphor-icons/react';
export default function SuccessScreen({ text, requestId, onNewRequest }) {
  function downloadReceipt() {
    const body =
      'DEMO - FICTIONAL REQUEST\nReference: ' +
      requestId +
      '\nThis receipt is a browser-only simulation. No request, email, or document was sent to an employer.';
    const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = requestId + '.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="success">
      <div className="success-check">
        <Check size={30} />
      </div>
      <p className="question-kicker">{text.demoLabel}</p>
      <h1 className="question-title">{text.successTitle}</h1>
      <p className="question-hint">{text.successSubtitle}</p>
      <div className="req-id">
        <span>{text.yourRequestNumber}</span>
        <strong dir="ltr">{requestId}</strong>
        <span className="receipt-status">{text.simulatedStatus}</span>
      </div>
      <div className="actions">
        <button className="btn btn-primary" onClick={onNewRequest}>
          {text.newRequest}
          <ArrowRight size={17} />
        </button>
        <button className="btn btn-ghost" onClick={downloadReceipt}>
          <DownloadSimple size={17} />
          {text.downloadReceipt}
        </button>
      </div>
    </div>
  );
}
