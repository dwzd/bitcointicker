//jshint esversion: 6

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
  // console.log(req.body.crypto);
  // console.log(req.body.fiat);
  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var baseUrl = "https://apiv2.bitcoinaverage.com/indices/global/ticker/";
  var url = baseUrl + crypto + fiat;
  request(url, function(error, response, body){
    // console.log(response.statusCode);
    // console.log(body);
    var priceData = JSON.parse(body);
    var lastPrice = priceData.last;
    var averagesWeek = priceData.averages.week;
    var currentDate = priceData.display_timestamp;

    res.write("<p>The current time is " + currentDate + "</p>");
    res.write("<h1>The current price of " + crypto + " is " + lastPrice + fiat + ".</h1>");
    res.send();
    // console.log(lastPrice);
    // console.log(averagesWeek);
  });
});

app.get("/price", function(req, res){
  res.sendFile(__dirname + "/price.html");
});

app.post("/price", function(req, res){
  var crypto = req.body.crypto;
  var fiat = req.body.fiat;
  var amount = req.body.amount;
  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: fiat,
      amount: amount
    }
  };

  request(options, function(error, response, body){
    var convertPrice = JSON.parse(body);
    var totalPrice = convertPrice.price;
    var time = convertPrice.time;
    console.log(totalPrice);
    res.write("<p style='color:#ff8000'>The current convert time is " + time + "</p>");
    res.write("<h1>The " + amount + crypto + " is currently worth " + totalPrice + fiat + "</h1>");
    res.send();
  });
});

app.listen(3003, function(){
  console.log("This server is working on port 3003.");
});
