export function usePdfAttachment(setForm, setError) {
  function pickPdf() {
    setForm((previous) => ({
      ...previous,
      pdfFile: 'generated-demo-document',
      pdfFileName: 'DEMO-fictional-supporting-document.pdf',
    }));
    setError('');
  }
  function removePdf() {
    setForm((previous) => ({ ...previous, pdfFile: '', pdfFileName: '' }));
  }
  return { pickPdf, removePdf };
}
