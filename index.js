const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'YourAppName/1.0 (your@email.com)'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Geocode error:', err);
    res.status(500).json({ error: 'Failed to fetch geocode' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
