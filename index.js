const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
<<<<<<< HEAD
const app = require("express")();
const puppeteer = require("puppeteer");

// Allow requests from specific domain(s)
const corsOptions = {
  origin: process.env.HOST || 'mylinkgenie.com',
=======

const app = express();

// Allow requests from specific domain(s)
const corsOptions = {
  origin: process.env.HOST || 'http://localhost:3002', // Replace with your actual domain
>>>>>>> fc145414a6f965e23deb26e4a2c30203565e1eaa
};

app.use(cors(corsOptions));

app.get('/api/geo_ip', async (req, res) => {
<<<<<<< HEAD
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: "/usr/bin/chromium-browser",
    args: ["--no-sandbox", "--disable-gpu"],
  });
  
  console.log("Opening the browser...");
  try {
=======
  try {
    const browser = await puppeteer.launch();
>>>>>>> fc145414a6f965e23deb26e4a2c30203565e1eaa
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
    
    res.json(combinedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await browser.close();
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



