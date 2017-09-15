const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");

//Storing URL's
let urlDatabase = {
  "b2xVn2": {
    id: "b2xVn2",
    url: "http://www.lighthouselabs.ca",
    uniqueId: "t7E2"
  },
  "9sm5xK": {
    id: "9sm5xK",
    url: "http://www.google.com",
    uniqueId: "uR69"
  }
};

//url database
let users = {
  "t7E2": {
    id: "t7E2",
    email: "example@gmail.com",
    password: "password"
  },
  "uR69": {
    id: "uR69", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

//Create short string of characters
function generateRandomString(number) {
  let shortU = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < number; i++) {
    shortU += possible.charAt(Math.floor(Math.random() * possible.length));
  };
  return shortU;
};

//Home, link index

  function urlsForUser(id) {
    let urlDatabaseForUser = {};
    for (let i in urlDatabase) {
      if (urlDatabase[i].uniqueId === id) {
        urlDatabaseForUser[i] = urlDatabase[i];
      }
    }
    return urlDatabaseForUser;
  }

  app.get("/urls", (req, res) => {
    let templateVars = { urls: urlsForUser(req.cookies["id"]), user_id: req.cookies["id"]};
    res.render("urls_index", templateVars);
  });


//Page for reating a new shortened link
app.get("/urls/new", (req, res) => {
  if (!req.cookies.id) {
    res.redirect("/urls/login")
    return
  }
  
  let templateVars = { user_id: req.cookies["id"],
    user_email: req.cookies["email"],
    user_password: req.cookies["password"] }
  res.render("urls_new", templateVars);
});

//user registration page
app.get("/urls/register", (req, res) => {
  res.render("urls_register");
});

app.get("/urls/login", (req,res) => {
  res.render("urls_login");
});

//Redirect to full version of shortened link
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url
  res.redirect(longURL);
});

//Display page with shortened link 
app.get("/urls/:id", (req, res) => {
  let templateVars = { url: urlDatabase[req.params.id], 
    user_id: req.cookies['id'],
    linkOut: "/u/" + req.params.id
  };
  res.render("urls_show", templateVars);
});

//===================================================================//


//User inputs new link, updates database
app.post("/urls", (req, res) => {
  let tempObject = {}
  let assign = generateRandomString(6);

  tempObject.id = assign
  tempObject.url = req.body.longURL;
  tempObject.uniqueId = req.cookies["id"]

  urlDatabase[assign] = tempObject

  res.redirect("/urls/" + assign);
  assign = "";
});

//deleting key/value pair from db
app.post("/urls/:id/delete", (req, res) => {
  let short = urlDatabase[req.params.id]
  if (req.cookies["id"] === short.uniqueId) {
    delete urlDatabase[req.params.id]; 
    res.redirect("/urls/"); 
    return
  };
  res.status(403).send("You must be the creator to modify or delete links")  
});

//modifying longURL in database
app.post("/urls/:id/modify", (req, res) => {
  let short = urlDatabase[req.params.id]
  let long = urlDatabase[req.params.id]
  if (req.cookies["id"] === short.uniqueId) {
    long.url = req.body.long
    res.redirect("/urls/");
    return
  };
  res.status(403).send("You must be the creator to modify or delete links")
});

//login page
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password
  for (i in users) {
    if (users[i].email === email) {
      if (users[i].password === password) {
        res.cookie("id", users[i].id)
        res.cookie("email", users[i].email)
        res.cookie("password", users[i].password)
        res.redirect("/urls/");
        return 
      };
    };
  };
  res.status(403).send("Invalid email/password combination")
});

//adding user credentials, if either field not filled out prperly or email already exists, error code is returned
app.post("/register", (req, res) => {

  if (!req.body.email || !req.body.password) {
    res.status(400).send("Either the email or password field was empty. Please try again.")
    return
  };

  for (var i in users) {
    if (req.body.email == users[i].email) {
      res.status(400).send("Email exists already")
      return
    };
  };
  let newID = generateRandomString(4)
  res.cookie("id", newID);
  res.cookie("email", req.body.email);
  res.cookie("password", req.body.password);

  users[newID] = {
    id: newID,
    email: req.body.email,
    password: req.body.password
  };
  res.redirect("/urls/");
});  

//logout the single username field
app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.clearCookie("email");
  res.clearCookie("password");
  res.redirect("/urls/");
});

//port
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
