require("dotenv").config();
const express = require("express");
const axios = require('axios')
const app = express();
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const PORT = process.env.PORT || 5000;

app.use(express.static("assets"));
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

app.get("/", (req, res) => {
  
  
  // var quoteAuthor;
  //  const settings = {
  //     "async": true,
  //     "crossDomain": true,
  //     "url": "https://type.fit/api/quotes",
  //     "method": "GET"
  //   }
  //   axios.request(settings).then(function (response) {

  //     var numQuotes = response.data.length;
  //     var randomQuote  = Math.floor(Math.random() * numQuotes); 
      
  //     // quote = response.data[randomQuote].text;
  //     quoteAuthor = response.data[randomQuote].author;
  //     console.log(quote + "--" + quoteAuthor);
    
  //    });

     res.render(__dirname + "/assets/index.html", {display: quote});
});

app.post("/", (req, res) => {
  console.log(req.body); //from post in app.js


  const accessToken = oAuth2Client.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "vigneshc5723@gmail.com", //user which has access to send emails, change to admin email
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: req.body.email,
    to: "vigneshc5723@gmail.com",
    subject: `Message from ${req.body.email}: ${req.body.subject}`,
    text: `${req.body.message} \n\n From: ${req.body.name}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error");
    } else {
      console.log("Email sent :) -Vignesh " + info.response);
      res.send("success");
    }
  });
});

app.listen(PORT, () => {
  console.log("Server running on port 5000");
});
