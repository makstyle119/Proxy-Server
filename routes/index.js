const url = require('url');
const express = require('express');
const router = express.Router();
const needle = require('needle');
const apicache = require('apicache');

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY_VALUE = process.env.API_KEY_VALUE;

// Init Cache
let cache = apicache.middleware;

router.get('/', cache('2 minutes'), async (req, res) => {
  try {
    const params = new URLSearchParams({
      [API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });

    const apiRes = await needle('get', `${API_BASE_URL}?${params}`);
    const data = apiRes.body;

    // log the request to the public API
    if (process.env.NODE_EN !== 'production') {
      console.log(`REQUEST: ${API_BASE_URL}?${params}`);
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ err });
  }
});

module.exports = router;
