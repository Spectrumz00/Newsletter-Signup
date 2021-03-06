// (IMPORTANT) Enter your Server Number , List ID , API key. (IMPORTANT)
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email_add;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };
  const jsonData = JSON.stringify(data);


  // (IMPORTANT) Enter your Server Number , List ID , API key here. (IMPORTANT)


  const url = "https:us{SERVER NUMBER}.api.mailchimp.com/3.0/lists/{LIST ID}";
  const options = {
    auth: "XYZ:{API KEY}",
    method: "POST"
  };
  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      if (response.statusCode === 200)
        res.sendFile(__dirname + "/success.html");
      else
        res.sendFile(__dirname + "/failure.html");
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
});
