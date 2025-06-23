const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function extractSignature(pdfPath) {
  const pdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const acroForm = pdfDoc.catalog.lookupMaybe('AcroForm');
  if (!acroForm) return console.log('No AcroForm (no signature).');

  const fields = acroForm.lookup('Fields');
  for (const ref of fields.array) {
    const field = ref.lookup();
    const type = field.lookup('FT');

    if (type && type.name === 'Sig') {
      const sigDict = field.lookup('V'); // Signature value dictionary
      if (!sigDict) {
        console.log('Signature field exists but is empty.');
        continue;
      }

      const contents = sigDict.lookup('Contents');
      const rawSignature = contents?.value;

      if (rawSignature) {
        fs.writeFileSync('extracted-signature.pkcs7', rawSignature);
        console.log('🔐 Signature extracted to: extracted-signature.pkcs7');
      } else {
        console.log('No signature content found.');
      }
    }
  }
}

extractSignature('digitally-signed.pdf');
