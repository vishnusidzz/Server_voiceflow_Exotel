const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('✅ Voiceflow-Exotel test webhook is running');
});

// Exotel webhook endpoint
app.post('/exotel-to-voiceflow', (req, res) => {
  const userText = req.body.SpeechResult || req.body.Digits || 'nothing detected';

  console.log('📞 Incoming input:', userText);

  // Return XML to speak the input back to caller
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Say>You pressed or said: ${userText}. This is a test response from your server.</Say>
      <Gather numDigits="1" timeout="5" />
    </Response>
  `);
});

// Start server on Render
app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Test Voiceflow-Exotel webhook server running');
});