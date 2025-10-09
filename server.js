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
  const sql="select * from flights join airlines on flights.airline_id=airlines.airline_id where flights.origin=? and flights.destination=? and flights.departure_time like ? and flights.airline_id=airlines.airline_id";
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
function getdata(table,email,number){
  const sql=`select passenger_id from ${table} where email=? and phone=?`;
  connection.query(sql,[email,number],(err,result)=>{
    if(err) return res.status(404).json("not found");
    res.json(result);
  })
}
function postdata(table,firstname,lastname,email,number){
  const sql=`insert into ${table} (firstname,lastname,email,phone) values (?,?,?,?)`;
  connection.query(sql,[firstname,lastname,email,number],(err,result)=>{
    if (err) return res.status(500).json("not able to add");
    getdata(passengers,email,number);
  })
}

app.post("/api/flightbookings", (req, res) => {
  console.log("req recived");
  const { firstname, lastname, email, number,flightNumber } = req.body;
  const sql = "SELECT passenger_id FROM passengers WHERE email=?";
  const sql3="insert into bookings (passenger_id,flight_id,booking_date) values (?,?,NOW())";
  const sql4="select flight_id from flights where flight_number=?";
  connection.query(sql4,[flightNumber],(err5,result5)=>{
    if(err5){console.error("error finding flights",err5);
      return res.status(500).json({ error: "Database error while fetching flight" });
    }
    if(result5.length==0){console.log("no matching flights");
      return res.status(500).json({ error: "Database error while fetching flight" });
    }
    const flightId=result5[0].flight_id;
    console.log("flight number",flightId);
  
  console.log('query processing',sql);

  connection.query(sql, [email], (err, result) => 
    {
    if (err) {
      console.log('error in first query');
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length > 0) {
      console.log('have a result');
      console.log("creating new booking");
      connection.query(sql3,[result[0]['passenger_id'],flightId],(err4)=>{
        if (err4){return res.status(500).json("couldnt create booking",err4) }
        console.log("temporary booking created for existing passenger");
        return res.json({ message: "Booking successful for existing passenger" });
      })
      return;
      
      
    }

    const inssql = "INSERT INTO passengers (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)";
    console.log("running insql");
    connection.query(inssql, [firstname, lastname, email, number], (err2,result2) => {
      if (err2) {
        console.error("Error inserting passenger:", err2);
        return res.status(500).json({ error: "Could not insert passenger" }); // stop here
      }
      console.log("addition successfull");
      const newPassengerId = result2.insertId;
      console.log(newPassengerId);
      console.log(flightId);

      // Only runs if insert succeeded

        // uses insertId for creating new booking as previous search query resulted in delay and crashes
        connection.query(sql3, [newPassengerId,flightId], (err4, result4) => {
  if (err4) {
    console.error("Booking creation failed!");
    console.error("SQL used:", sql3);
    console.error("Values:", [newPassengerId,flightId]);
    console.error("Full MySQL error:", err4);
    return res.status(500).json({
      error: "Booking creation failed",
      details: err4.message || err4.message,
    });
  }

  console.log("Temporary booking created for new passenger");
  return res.json({ message: "Booking successful for new passenger" });
});

      
      
    });
  });
  });
  
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
