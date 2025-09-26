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
  const sql ="select flight_number,origin,destination,substr(departure_time,1,10) as date,substr(departure_time,12,19) as time from flights where flight_number=?";
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
app.get("/api/flight/:from/:to/:date" ,(req,res) => {
  const { from,to,date} = req.params;
  if (!from || !to || !date) {
      return res.status(400).json({error:'enter origin,destination'});
  }
  else
  {
  const sql="select * from flights where origin=? and destination=? and departure_time like ?";
  connection.query(sql,[from,to,date+"%"],(err,result)=>{
    if (err){
      return res.status(500).json({error:'error connecting'});
    }
    if (result.length==0){
      return res.status(404).json({error:'no flights found'});
    }
    res.json(result);
  })
}
  // res.json({message: `Flight ${from} will appear here`});
})
app.get("/api/booking/:bookingid",(req,res) => {
  const { bookingid }=req.params;
  const sql="select booking_id,flight_id,booking_date,seat_number,status from bookings where booking_id=?";
  connection.query(sql,[bookingid],(err,result)=>{
    if (err){
      return res.status(500).json({error:'error connecting'});
    }
    if (result.length==0){
      return res.status(404).json({error:'no record found'});
    }
    res.json(result);
  })
}) 

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
