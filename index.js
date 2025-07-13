const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'No URL provided' });

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'No title';
    const image = $('meta[property="og:image"]').attr('content') || '';
    const price = $('meta[property="product:price:amount"]').attr('content') || $('span.price').first().text() || 'Unknown';

    res.json({ title, image, price, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Scraper running on port ${PORT}`));
