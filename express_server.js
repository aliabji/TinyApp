var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

let shortU = "";
let parsed = "";

function generateRandomString() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    shortU += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return shortU;
}

//app.get("/", (req, res) => {
//  res.end("Hello!");
//});

//app.get("/urls", (req, res) => {
//  res.json(urlDatabase);        
//});

app.get("/", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  console.log(req.params.shortURL, "/u/shortURL");
  console.log(urlDatabase, "before redirect")
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    linkOut: "/u/" + req.params.id,
  };

  res.render("urls_show", templateVars);
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});



app.post("/urls", (req, res) => {
  let assign = generateRandomString();
  console.log(urlDatabase, "Before")
  urlDatabase[assign] = req.body.longURL;
  console.log(urlDatabase, "AFTER")
  res.redirect("/urls/" + assign)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

