const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Voiceflow API key & user ID
const VF_API_KEY = 'VF.DM.6860b61af49c34937af1f919.qI2UbJkGAWan2sKV'; // Replace with your real key if needed
const DEFAULT_USER_ID = 'vishnu123'; // Can use req.body.From from Exotel for dynamic ID

// Health check route (so you can test Render deployment)
app.get('/', (req, res) => {
  res.send('✅ Voiceflow-Exotel webhook is running');
});

// Main webhook route used by Exotel call flow
app.post('/exotel-to-voiceflow', async (req, res) => {
  const userText = req.body.SpeechResult || req.body.Digits || 'Hello';
  const userID = req.body.From || DEFAULT_USER_ID;

  console.log('📞 Incoming call from:', userID);
  console.log('🗣️ User said or pressed:', userText);

  let reply = 'Sorry, something went wrong. Please try again.';

  try {
    const vfResponse = await axios.post(
      `https://general-runtime.voiceflow.com/state/${userID}/interact`,
      {
        request: {
          type: 'text',
          payload: userText,
        },
      },
      {
        headers: {
          Authorization: VF_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract message from Voiceflow response
    const vfMessage = vfResponse.data?.[0]?.payload?.message;
    if (vfMessage) reply = vfMessage;

  } catch (error) {
    console.error('❌ Voiceflow API Error:', error.message);
  }

  // Return XML response for Exotel to speak
  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Say>${reply}</Say>
      <Gather numDigits="1" timeout="5" />
    </Response>
  `);
});

// Server start for Render deployment
app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Voiceflow-Exotel webhook server is running');
});