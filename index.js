const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { mergeSignPDF } = require('./SignPDF');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'build')));


// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json({limit: '10mb' }));

// Sample route
app.get('/', (req, res) => {
  res.json({ message: 'CORS-enabled Express API 🎉' });
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.post('/upload', async (req, res) => {
  const { base64, filename } = req.body;

  if (!base64 || !filename) {
    return res.status(400).json({ message: 'base64 and filename are required' });
  }

  // Remove the data URL prefix if present
  const base64Data = base64.replace(/^data:.*;base64,/, '');

  // Save the file
  const filePath = path.join(uploadDir, filename);

  fs.writeFile(filePath, base64Data, 'base64', async (err) => {
    if (err) {
      console.error('❌ Failed to save file:', err);
      return res.status(500).json({ message: 'Error saving file' });
    }
 await mergeSignPDF('singed2.pdf',filePath)
 fs.readFile('singed2.pdf',{encoding:"base64"},(err,data)=>{
if(err) {
  console.error('❌ Failed to save file:', err);
      return res.status(500).json({ message: 'Error saving file' });
}
   res.status(200).json({data})   
 })
    // console.log(`✅ File saved: ${filePath}`);
    // res.json({ message: 'File saved successfully', path: `uploads/${filename}` });
  });
 
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});