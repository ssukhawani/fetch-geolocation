const cors = require('cors');

const app = require("express")();

let chrome = {};
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require("chrome-aws-lambda");
  puppeteer = require("puppeteer-core");
} else {
  puppeteer = require("puppeteer");
}

// Allow requests from specific domain(s)
const corsOptions = {
  origin: process.env.HOST || 'mylinkgenie.com',
};

app.use(cors(corsOptions));

app.get('/api/geo_ip', async (req, res) => {
  let options = {};

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

  try {
    const browser = await puppeteer.launch(options);
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

app.listen(process.env.PORT || 3002, () => {
  console.log("Server started");
});


module.exports = app;