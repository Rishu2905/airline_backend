// server.js (Backend)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());




app.get("/api/flight/:flightNo", (req, res) => {
  const { flightNo } = req.params;
  res.json({ message: `Flight ${flightNo} data will be here` });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
