const fs = require('fs');
const signer = require('node-signpdf').default;
const { plainAddPlaceholder } = require('node-signpdf/dist/helpers');

const pdfBuffer = fs.readFileSync('input.pdf');
const p12Buffer = fs.readFileSync('certificate.p12');

const pdfWithPlaceholder = plainAddPlaceholder({
  pdfBuffer,
  reason: 'I am the author',
  signatureLength: 1612,
});

const signedPdf = signer.sign(pdfWithPlaceholder, p12Buffer, {
  passphrase: '123456789',
});

fs.writeFileSync('digitally-signed.pdf', signedPdf);
