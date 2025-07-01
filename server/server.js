const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // לתמיכה ב-application/json

const upload = multer({ dest: 'uploads/' });

// נשתמש ב-upload.single כדי לקבל קובץ
app.post('/send-email', upload.single('file'), (req, res) => {
  let { to, subject, body } = req.body;

  // תמיכה גם במקרה שבו 'to' הוא מחרוזת מופרדת בפסיקים
  if (typeof to === 'string') {
    to = to.split(',').map(email => email.trim());
  }

  if (!Array.isArray(to)) {
    return res.status(400).json({ success: false, error: "'to' חייב להיות מערך או מחרוזת של מיילים" });
  }

  // הנתיב המלא של הקובץ שהועלה
  const attachmentPath = req.file ? path.resolve(req.file.path) : '';
  const attachmentName = req.file ? req.file.originalname : ''; // זה חייב להיות ברור

  const promises = to.map(email => {
    return new Promise((resolve, reject) => {
      const command = `powershell -File CreateOutlookDraft.ps1 `
        + `-to "${email}" `
        + `-subject "${subject}" `
        + `-body "${body}"`
        + (attachmentPath ? ` -attachmentPath "${attachmentPath}" -attachmentName "${attachmentName}"` : '');

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error for ${email}:`, stderr);
          reject(error);
        } else {
          console.log(`Draft created for ${email}`);
          resolve(stdout);
        }
      });
    });
  });

  Promise.all(promises)
    .then(results => {
      res.json({ success: true, message: 'Email drafts created for all recipients' });
    })
    .catch(err => {
      res.status(500).json({ success: false, error: err.message });
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
