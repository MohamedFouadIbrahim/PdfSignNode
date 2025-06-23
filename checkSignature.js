const fs = require('fs');

function checkSignature(path) {
  const buffer = fs.readFileSync(path);
  const text = buffer.toString('latin1'); // Preserve raw bytes

  const hasSignature = text.includes('/Sig');

  console.log(hasSignature ? 'PDF is signed ✅' : 'PDF is not signed ❌');
}

// checkSignature('digitally-signed.pdf');
checkSignature('input.pdf');
