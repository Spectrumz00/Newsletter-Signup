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
  const url = "https:us6.api.mailchimp.com/3.0/lists/b895f948d7";
  const options = {
    auth: "XYZ:0baffcb36abbee87bc392c16471cdd53-us6",
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

// API Key : 0baffcb36abbee87bc392c16471cdd53-us6
// List ID : b895f948d7
// Server : us6
