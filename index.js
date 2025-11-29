import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Reverse geocoding route
app.get('/reverse', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon' });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

  try {
    const response = await fetch(url, {
      headers: {
        // REQUIRED by Nominatim, otherwise returns HTML error
        'User-Agent': 'GeocodeProxy/1.0 (contact: your-email@example.com)'
      }
    });

    // Always read raw text first
    const text = await response.text();

    let data;

    // Try parsing JSON, otherwise return error (HTML pages)
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Received HTML instead of JSON:", text);
      return res.status(500).json({
        error: 'Nominatim returned non-JSON response (blocked or rate-limited)'
      });
    }

    res.json(data);

  } catch (err) {
    console.error('Error fetching geocode:', err);
    res.status(500).json({ error: 'Failed to fetch geocode data' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
