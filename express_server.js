const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser'); // npm install body-parser
const cookieParser = require('cookie-parser'); // npm install cookie-parser
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // npm install ejs
//
//  MIDDLEWARE
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); // set up cookie-parser

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

// global scope
function generateRandomString() {
  var random = Math.random().toString(36).slice(7);
  // console.log(random);
  return random;
  // cb(random);
}
//
// GET /
//
app.get('/', (req, res) => {
  res.send('Hello!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// app.get('/hello', (req, res) => {
//   res.send('<html><body>Hello <b>World</b></body></html>\n');
// });
// app.get('/hello', (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render('hello_world', templateVars);
// });

//
// GET /urls
//
// Cookies in Express
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

//
// GET /urls/new
//
// create short URL form
// The order of route definitions matters!
// 1:/urls/new
// 2:/urls/:shortURL
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies['username'],
  };
  res.render('urls_new', templateVars);
});

//
// GET /urls/:id
//
// short URL page set up
// https://expressjs.com/en/guide/routing.html#route-parameters  Object parameter set up
app.get('/urls/:shortURL', (req, res) => {
  // shortURL is like a call back function(shortURL){ shortURL()}
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies['username'],
    /* What goes here? */
  };
  res.render('urls_show', templateVars);
});
//
// DELITE
//
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURLDelete = req.params.shortURL;

  delete urlDatabase[shortURLDelete];
  res.redirect(`/urls`);
});

//
// GET /u/:id
//
// Redirect any request to longURL
app.get('/u/:shortURL', (req, res) => {
  // const longURL = ...
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

//
// POST /urls
//
app.post('/urls', (req, res) => {
  // console.log(req.body); // Log the POST request body to the console
  // res.send('Ok'); // Respond with 'Ok' (we will replace this)
  let shortU = generateRandomString();
  urlDatabase[shortU] = req.body.longURL;
  // longURL is urls_new.ejs from input form name="longURL"
  res.redirect(`/urls/${shortU}`);
});

//
// POST /urls/:id
//
// EDIT
app.post('/urls/:id', (req, res) => {
  let shortURL = req.params.id;
  console.log(req.body);
  console.log(req.body.newLongURL);
  let newLongURL = req.body.newLongURL;
  urlDatabase[shortURL] = newLongURL;
  // newLongURL is urls_show.ejs from input form name="newLongURL"
  res.redirect('/urls');
});

//
// GET /login
//

//
// GET /register
//

//
// POST /login
//
app.post('/login', (req, res) => {
  let newUserName = req.body.username;
  // console.log(req.cookies.username);
  //
  res.cookie('username', newUserName);
  // set server username as a cookie
  const templateVars = {
    username: newUserName,
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

//
// POST /register
//

//
// POST /logout
//
app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

//
// listen
//
// this is always end
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
