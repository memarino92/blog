import { jsPDF } from 'jspdf';
import { data, item } from './_data';

export function generatePDF(data: item[]): void {
  const doc = new jsPDF();
  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const lineHeight = 8;
  let currentPage = 1;

  let currentHeight = createPdfHeader(doc);

  for (let item of data) {
    if (currentHeight > pageHeight) {
      doc.addPage();
      currentPage++;
      currentHeight = createPdfHeader(doc);
    }
    doc.setFontSize(12);
    doc.text(item.name, 10, currentHeight);
    doc.text(`${item.quantity}`, pageWidth - 10, currentHeight, {
      align: 'right',
    });
    currentHeight += lineHeight;
  }

  createPdfFooter(doc, currentPage);

  window.open(doc.output('bloburl'));
}

function createPdfHeader(doc: jsPDF): number {
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const startingHeight = 10;
  let currentHeight = startingHeight;
  doc.setFontSize(20);
  doc.text('Packing List', pageWidth / 2, currentHeight, { align: 'center' });
  currentHeight += 10;
  doc.line(10, currentHeight, pageWidth - 10, currentHeight);
  return currentHeight + 10;
}

function createPdfFooter(doc: jsPDF, numberOfPages: number) {
  for (let i = 1; i <= numberOfPages; i++) {
    doc.setPage(i);
    doc.line(
      10,
      doc.internal.pageSize.height - 20,
      doc.internal.pageSize.width - 10,
      doc.internal.pageSize.height - 20
    );
    doc.text(
      `Page ${i} of ${numberOfPages}`,
      10,
      doc.internal.pageSize.height - 10
    );
  }
}

function OverlappingFooter() {
  const handleClick = () => {
    generatePDF(data);
  };

  return <button onClick={handleClick}>Generate PDF</button>;
}

export default OverlappingFooter;
