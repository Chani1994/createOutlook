import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
} from '@mui/material';

const MailForm = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipients, setRecipients] = useState('');
  const [file, setFile] = useState(null);

  const handleSend = async () => {
    const recipientList = recipients.split(',').map(item => item.trim()); // לפצל את הכתובת למספר כתובות
    try {
      for (const recipient of recipientList) {
        const formData = new FormData(); // יצירת FormData  לכל שליחה
        formData.append('to', recipient);
        formData.append('subject', subject);
        formData.append('body', body);
        if (file) {
          formData.append('file', file);
        }

        const response = await fetch('http://localhost:3001/send-email', {
          method: 'POST',
          body: formData, // שליחה עם FormData  לכל כתובת
        });

        const data = await response.json();
        if (data.success) {
          alert(`הבקשה נפתחה בהצלחה ל-${recipient}`);
        } else {
          alert(`אירעה שגיאה בשליחת המייל ל-${recipient}`);
        }
      }
    } catch (error) {
      alert('שגיאה בתקשורת עם השרת');
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(btoa(reader.result));
      reader.onerror = reject;
      reader.readAsBinaryString(file);
    });

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 500 }}>
        <Typography variant="h5" align="center" gutterBottom>
          שליחת קורות חיים
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="נושא"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            fullWidth
          />
          <TextField
            label="כתובות נמען (מופרדות בפסיקים)"
            value={recipients}
            onChange={e => setRecipients(e.target.value)}
            fullWidth
          />
          <TextField
            label="גוף ההודעה"
            value={body}
            onChange={e => setBody(e.target.value)}
            multiline
            rows={4}
            fullWidth
          />
          <Button variant="outlined" component="label">
            העלאת קובץ קורות חיים
            <input
              type="file"
              hidden
              onChange={e => setFile(e.target.files[0])}
            />
          </Button>
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!subject || !recipients || !body || !file}
          >
            שליחה
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default MailForm;
