import { jsPDF } from 'jspdf';
import { data, item } from './_data';

type lineHeightFunction = (fontSize: number) => number;

interface IDocumentConfig {
  pageHeight: number;
  pageWidth: number;
  getLineHeight: lineHeightFunction;
  margin: number;
  normalFontSize: number;
  titleFontSize: number;
  numberOfPages: number;
}

export function generatePDF(data: item[]): void {
  const doc = new jsPDF();
  const pageHeight =
    doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth =
    doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const getLineHeight = (fontSize: number): number => fontSize / 2;
  const margin = 15;
  const normalFontSize = 16;
  const titleFontSize = 28;
  let currentPage = 1;

  let config: IDocumentConfig = {
    pageHeight: pageHeight,
    pageWidth: pageWidth,
    getLineHeight: getLineHeight,
    margin: margin,
    normalFontSize: normalFontSize,
    titleFontSize: titleFontSize,
    numberOfPages: currentPage,
  };

  let currentHeight = createPdfHeader(doc, config);

  for (let item of data) {
    if (currentHeight > pageHeight - (margin + getLineHeight(normalFontSize))) {
      doc.addPage();
      currentPage++;
      config.numberOfPages = currentPage;
      currentHeight = createPdfHeader(doc, config);
    }
    doc.setFontSize(normalFontSize);
    doc.text(item.name, margin, currentHeight);
    doc.text(`${item.quantity}`, pageWidth - margin, currentHeight, {
      align: 'right',
    });
    currentHeight += getLineHeight(normalFontSize);
  }

  createPdfFooter(doc, config);

  window.open(doc.output('bloburl'));
}

function createPdfHeader(
  doc: jsPDF,
  {
    pageWidth,
    getLineHeight,
    margin,
    titleFontSize,
    normalFontSize,
  }: IDocumentConfig
): number {
  let currentHeight = margin;
  doc.setFontSize(titleFontSize);
  doc.text('Packing List', pageWidth / 2, currentHeight, { align: 'center' });
  currentHeight += getLineHeight(titleFontSize);
  doc.setFontSize(normalFontSize);
  doc.text('Item Name', margin, currentHeight);
  doc.text('Quantity', pageWidth - margin, currentHeight, { align: 'right' });
  currentHeight += getLineHeight(normalFontSize);
  doc.line(margin, currentHeight, pageWidth - margin, currentHeight);
  return currentHeight + getLineHeight(normalFontSize);
}

function createPdfFooter(
  doc: jsPDF,
  {
    pageWidth,
    pageHeight,
    getLineHeight,
    margin,
    normalFontSize,
    numberOfPages,
  }: IDocumentConfig
): void {
  for (let i = 1; i <= numberOfPages; i++) {
    doc.setPage(i);
    doc.line(
      margin,
      pageHeight - margin - getLineHeight(normalFontSize),
      pageWidth - margin,
      pageHeight - margin - getLineHeight(normalFontSize)
    );
    doc.text(`Page ${i} of ${numberOfPages}`, margin, pageHeight - margin);
  }
}

function CorrectedFooter() {
  const handleClick = () => {
    generatePDF(data);
  };

  return <button onClick={handleClick}>Generate PDF</button>;
}

export default CorrectedFooter;
