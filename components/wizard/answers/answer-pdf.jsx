import { FilePdf, CheckCircle, DownloadSimple, Plus, X } from '@phosphor-icons/react';
import { downloadSamplePdf } from '@/lib/demo-document';
export default function AnswerPdf({ text, form, onPickPdf, onRemovePdf }) {
  return (
    <div className="document-panel">
      <div className="document-icon">
        {form.pdfFile ? <CheckCircle size={32} /> : <FilePdf size={32} />}
      </div>
      <strong>{form.pdfFile ? text.documentAttached : text.sampleDocument}</strong>
      <p>{text.documentDescription}</p>
      <div className="document-actions">
        <button className="btn btn-primary" onClick={form.pdfFile ? onRemovePdf : onPickPdf}>
          {form.pdfFile ? <X size={17} /> : <Plus size={17} />}
          {form.pdfFile ? text.removeFile : text.chooseFile}
        </button>
        <button className="document-download" onClick={downloadSamplePdf}>
          <DownloadSimple size={17} />
          {text.downloadSample}
        </button>
      </div>
      <span className="document-label">{text.fictionalDocument}</span>
    </div>
  );
}
