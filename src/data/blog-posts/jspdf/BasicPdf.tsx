import { data, item } from './_data';
import { jsPDF } from 'jspdf';

function generatePDF(data: item[]): void {
  const doc = new jsPDF();
  const listofItems = data.map((item) => `${item.name} - ${item.quantity}`);
  doc.text(listofItems, 10, 10);
  window.open(doc.output('bloburl'));
}

function BasicPdf() {
  const handleClick = () => {
    generatePDF(data);
  };

  return <button onClick={handleClick}>Generate PDF</button>;
}

export default BasicPdf;
