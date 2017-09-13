var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

//Storing URL's
var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Create short link
function generateRandomString() {
  var shortU = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++) {
    shortU += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return shortU;
};


//Home, link index
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Page for reating a new shortened link
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Redirect to full version of shortened link
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

//Display page with shortened link 
app.get("/urls/:id", (req, res) => {
  let templateVars = { 
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    linkOut: "/u/" + req.params.id,
  };

  res.render("urls_show", templateVars);
});

//User inputs new link, updates database
app.post("/urls", (req, res) => {
  let assign = generateRandomString();
  urlDatabase[assign] = req.body.longURL;
  res.redirect("/urls/" + assign)
  assign = ""
});

//deleting key/value pair from db
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id]
  res.redirect("/urls/")
});

//modifying longURL in database
app.post("/urls/:id/modify", (req, res) => {
  urlDatabase[req.params.id] = req.body.long
  res.redirect("/urls/")
})

//port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

