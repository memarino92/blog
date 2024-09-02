import { data, item } from './_data';
import { jsPDF } from 'jspdf';

function generatePDF(data: item[]): void {
  const doc = new jsPDF();
  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const lineHeight = 8;
  const startingHeight = 10;
  let currentHeight = startingHeight;

  for (let item of data) {
    if (currentHeight > pageHeight) {
      doc.addPage();
      currentHeight = startingHeight;
    }
    doc.text(item.name, 10, currentHeight);
    doc.text(`${item.quantity}`, pageWidth - 10, currentHeight, {
      align: 'right',
    });
    currentHeight += lineHeight;
  }

  window.open(doc.output('bloburl'));
}

function MultiplePages() {
  const handleClick = () => {
    generatePDF(data);
  };

  return <button onClick={handleClick}>Generate PDF</button>;
}

export default MultiplePages;
