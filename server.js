const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.js');
const cors = require('cors');
const fs = require('fs');

require('dotenv').config()

var app = express();

app.use(cors({
    origin: '*', // or use '*' to allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods if needed
}));

// Middleware
app.use(bodyParser.json());

// Connect with mongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true    
}).then(() => {
    console.log('connected to MongoDB')
}).catch((err) => {
    console.log('MongoDB connection error:', err)
});

const TOKENS_FILE = './tokens.json';

function readTokens() {
  const data = fs.readFileSync(TOKENS_FILE, 'utf-8');
  return JSON.parse(data);
}

// POST /tokens — returns all tokens without needing a request body
app.post('/api/tokens', (req, res) => {
  try {
    const tokens = readTokens();
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});


// Routes
app.use('/api/auth', authRoutes);

// Mobile passkey server
app.get("/.well-known/apple-app-site-association", (req, res) => {
    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
    const appIdentifier = "FZZKKA62H4.com.adi52.abstractionkitrnpasskeysexample";
  
    res.json({
      webcredentials: {
        apps: [appIdentifier],
      },
      applinks: {
        details: [
          {
            appIDs: [appIdentifier],
            components: [
              {
                "/": "/*",
                comment: "Matches any URL",
              },
            ],
          },
        ],
      },
    });
  });

  app.get("/.well-known/assetlinks.json", (req, res) => {
    res.set({
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    });
  
    res.json([
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.vigneshbdx.safehodl_v2",
          sha256_cert_fingerprints: [
            "FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C",
          ],
        },
      },
    ]);
  });

// Start the server on 127.0.0.1:4000
const PORT = process.env.PORT || 4000;
const HOST = '127.0.0.1';

app.listen(PORT, HOST, function () {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
