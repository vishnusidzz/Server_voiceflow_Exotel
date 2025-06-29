const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.urlencoded({ extended: true }));

const VF_API_KEY = 'VF.DM.6860b61af49c34937af1f919.qI2UbJkGAWan2sKV';
const USER_ID = 'vishnu123';

app.post('/exotel-to-voiceflow', async (req, res) => {
  const userText = req.body.SpeechResult || req.body.Digits || "Hello";

  const vfRes = await axios.post(
    `https://general-runtime.voiceflow.com/state/${USER_ID}/interact`,
    {
      request: { type: "text", payload: userText }
    },
    {
      headers: {
        Authorization: VF_API_KEY,
        'Content-Type': 'application/json'
      }
    }
  );

  const reply = vfRes.data?.[0]?.payload?.message || "Sorry, I didn't get that.";

  res.set('Content-Type', 'text/xml');
  res.send(`
    <Response>
      <Say>${reply}</Say>
      <Gather numDigits="1" timeout="5" />
    </Response>
  `);
});

app.listen(3000, () => {
  console.log('🚀 Webhook running on http://localhost:3000');
});