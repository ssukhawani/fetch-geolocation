const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();

// Allow requests from specific domain(s)
const corsOptions = {
  origin: process.env.HOST || 'http://localhost:3002', // Replace with your actual domain
};

app.use(cors(corsOptions));

app.get('/api/geo_ip', async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const apiEndpoints = [
      'https://whoer.net/v2/geoip2-city',
      'https://whoer.net/v2/geoip2-isp',
      'https://whoer.net/resolve'
    ];

    const combinedResponse = {};

    for (const endpoint of apiEndpoints) {
      await page.goto(endpoint);
      const response = await page.evaluate(() => {
        return fetch(window.location.href).then(res => res.json());
      });

      let key;
      if (endpoint.includes('geoip2-city')) {
        key = 'geoip-city';
      } else if (endpoint.includes('geoip2-isp')) {
        key = 'geoip-isp';
      } else {
        key = 'geoip-client-ip';
      }

      combinedResponse[key] = response;
    }

    await browser.close();
    
    res.json(combinedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



