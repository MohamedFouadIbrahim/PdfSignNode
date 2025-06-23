const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function signPDF(outputPath, signatureImagePath) {
  // const existingPdfBytes = fs.readFileSync(inputPath);
  // const signatureImageBytes = fs.readFileSync(signatureImagePath);

  const existingPdfBytes = fs.readFileSync("input.pdf");
  const signatureImageBytes = fs.readFileSync(signatureImagePath);

  
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const image = await pdfDoc.embedPng(signatureImageBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  firstPage.drawImage(image, {
    x: width - 150, // Adjust x/y to place the image
    y: 50,
    width: 100,
    height: 50,
  });

  const signedPdfBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, signedPdfBytes);
  return {
    signedPdfBytes
  }
}

module.exports = {
mergeSignPDF: signPDF
}
// signPDF('input.pdf', 'signed.pdf', 'signature.png');