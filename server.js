// server.js (Backend)

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection=require('./DB');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());



// link receiving requests
app.get("/api/flight/:flightNo", (req, res) => { // getting daqta from Flightdetails.js page using .get 
  const { flightNo } = req.params;
  const sql ="select * from flights where flight_number=?";
  connection.query(sql,[flightNo],(err,result) => { //sends query to database and store result in variable result
    if (err){
      return res.status(500).json({error:'error connecting'});
    }
    if(result.length==0){
      return res.status(404).json({error:'Flight not found'});
    }
    res.json(result[0]);
  })
});
app.get("/api/flight/:from" ,(req,res) => {
  const { from } = req.params;
  res.json({message: `Flight ${from} will appear here`});
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
