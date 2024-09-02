import { data, item } from './_data';
import { jsPDF } from 'jspdf';

function generatePDF(data: item[]): void {
  const doc = new jsPDF();
  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const lineHeight = 8;

  let currentHeight = createPdfHeader(doc);

  for (let item of data) {
    if (currentHeight > pageHeight) {
      doc.addPage();
      currentHeight = createPdfHeader(doc);
    }
    doc.setFontSize(12);
    doc.text(item.name, 10, currentHeight);
    doc.text(`${item.quantity}`, pageWidth - 10, currentHeight, {
      align: 'right',
    });
    currentHeight += lineHeight;
  }

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

function AddHeader() {
  const handleClick = () => {
    generatePDF(data);
  };

  return <button onClick={handleClick}>Generate PDF</button>;
}

export default AddHeader;
