// Generate a clearly fictional PDF without reading or accepting a real file.
export function samplePdfContent() {
  const stream =
    'BT /F1 20 Tf 52 740 Td (DEMO - FICTIONAL DOCUMENT) Tj 0 -44 Td /F1 12 Tf (Generated supporting document for the FORM portfolio demo.) Tj 0 -24 Td (No real employee information or medical record is included.) Tj ET';
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Length ' + stream.length + ' >>\nstream\n' + stream + '\nendstream',
  ];
  let content = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(content.length);
    content += index + 1 + ' 0 obj\n' + object + '\nendobj\n';
  });
  const xref = content.length;
  content += 'xref\n0 6\n0000000000 65535 f \n';
  content += offsets
    .slice(1)
    .map((offset) => String(offset).padStart(10, '0') + ' 00000 n \n')
    .join('');
  return content + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xref + '\n%%EOF';
}
export function downloadSamplePdf() {
  const url = URL.createObjectURL(new Blob([samplePdfContent()], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'DEMO-fictional-supporting-document.pdf';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
