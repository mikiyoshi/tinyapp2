const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser'); // npm install
const cookieSession = require('cookie-session'); // npm install
const bcrypt = require('bcryptjs'); // security for password
const { findUserByEmail, generateRandomString } = require('./helpers.js'); // Mocha and Chai test

app.set('view engine', 'ejs'); // npm install
//
//  MIDDLEWARE
//
app.use(bodyParser.urlencoded({ extended: false })); // this is a req.body from each page form value
app.set('trust proxy', 1); // trust first proxy

app.use(
  cookieSession({
    name: 'session',
    keys: [
      '40767e34-50b6-489e-81dd-d3883d695663',
      'f62a8200-3854-4f51-81ee-a27ce4d2c01f',
    ],
  })
); // set up cookie-session

// My URLs DB
// URLs Belong to Users
const urlDatabase = {
  b6UTxQ: {
    longURL: 'https://www.tsn.ca',
    userID: 'aJ48lW',
  },
  i3BoGr: {
    longURL: 'https://www.google.ca',
    userID: 'aJ48lW',
  },
};

// User DB
const users = {
  userRandomID: {
    id: 'userRandomID',
    email: 'user@example.com',
    password: '$2a$10$/0hDdrw4rAIfAjDtzWYkm.lcKLHymZijUrDNMbMQRpRpMj/RArhsi',
  },
  user2RandomID: {
    id: 'user2RandomID',
    email: 'user2@example.com',
    password: '$2a$10$js/2aVKSwvLs7O0.ax3H/uA6xb.x4TjPQkyRPhw6IX7BJoJpcPLtm',
  },
  aJ48lW: {
    id: 'aJ48lW',
    email: 'a@example.com',
    password: '$2a$10$1XI/g2nZH/R2ix3xDtMwQOW2e7nKWShvjshOcXCBMZmEamCfK.rkG',
  },
};

//
// GET /
//
app.get('/', (req, res) => {
  let cookieUser = req.session['user_id'];
  if (!cookieUser) {
    res.redirect(`/login`);
  }
  const templateVars = {
    user_id: cookieUser,
    user: users[cookieUser],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});
//
// GET DB by json // u can check your current data in Browser
//
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});
app.get('/users.json', (req, res) => {
  res.json(users);
});

//
// GET /urls
//
// Cookies in Express
app.get('/urls', (req, res) => {
  let cookieUser = req.session['user_id'];
  const templateVars = {
    user_id: cookieUser,
    user: users[cookieUser],
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
  let cookieUser = req.session['user_id'];
  if (!cookieUser) {
    res.redirect('/login');
  }
  const templateVars = {
    user: users[cookieUser],
    urls: urlDatabase,
  };
  res.render('urls_new', templateVars);
});

//
// GET /urls/:id
//
// short URL page set up
// https://expressjs.com/en/guide/routing.html#route-parameters  Object parameter set up
app.get('/urls/:shortURL', (req, res) => {
  let cookieUser = req.session['user_id'];
  if (!cookieUser) {
    return res.status(400).send('This URL does not exist');
  }
  let shortDatabase = Object.keys(urlDatabase);
  let shortURL = req.params.shortURL;
  if (!shortDatabase.includes(shortURL)) {
    return res.status(400).send('This URL does not exist');
  }
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    user_id: cookieUser,
    user: users[cookieUser],
  };
  res.render('urls_show', templateVars);
});
//
// DELITE
//
app.post('/urls/:shortURL/delete', (req, res) => {
  let cookieUser = req.session['user_id'];
  if (!cookieUser) {
    res.redirect(`/login`);
  }
  let shortDatabase = Object.keys(urlDatabase);
  let shortURL = req.params.shortURL;
  if (!shortDatabase.includes(shortURL)) {
    return res.status(400).send('This URL can not delete');
  }
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

//
// GET /u/:id
//
// Redirect any request to longURL
app.get('/u/:shortURL', (req, res) => {
  let cookieUser = req.session['user_id'];
  if (!cookieUser) {
    res.redirect(`/login`);
  }
  let shortDatabase = Object.keys(urlDatabase);
  let shortURL = req.params.shortURL;
  if (!shortDatabase.includes(shortURL)) {
    return res.status(400).send('This URL does not exist longURL');
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

//
// POST /urls
//
app.post('/urls', (req, res) => {
  let cookieUser = req.session['user_id'];
  let shortU = generateRandomString();
  let newLongURL = req.body.longURL;
  if (!newLongURL) {
    return res.status(400).send('A URL cannot be blank');
  }
  urlDatabase[shortU] = {
    longURL: req.body.longURL,
    userID: cookieUser,
  };
  res.redirect(`/urls/${shortU}`);
});

//
// POST /urls/:id
//
// EDIT
app.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  let newLongURL = req.body.newLongURL;
  if (newLongURL) {
    urlDatabase[shortURL].longURL = newLongURL;
    res.redirect('/urls');
  } else {
    res.send('No URL entered');
  }
});

//
// GET /login
//
app.get('/login', (req, res) => {
  let cookieUser = req.session['user_id'];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[cookieUser],
  };
  res.render('login', templateVars);
});

//
// GET /register
//
app.get('/register', (req, res) => {
  let cookieUser = req.session['user_id'];
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[cookieUser],
  };
  res.render('register', templateVars);
});

//
// POST /login
//
app.post('/login', (req, res) => {
  let loginEmail = req.body.email;
  let loginPassword = req.body.password;
  if (!loginEmail || !loginPassword) {
    return res.status(400).send('email and password cannot be blank');
  }
  const user = findUserByEmail(loginEmail, users);
  if (!user) {
    return res.status(400).send('a user with that email does not exist');
  }
  if (!bcrypt.compareSync(loginPassword, user.password)) {
    // password check bcrypt.compareSync() // true password match, false password not match
    return res.status(400).send('password does not match');
  }
  let loginId = user.id;
  req.session['user_id'] = loginId; // storing the user id value with cookie session
  res.redirect('/urls');
});

//
// POST /register
// res.render('home', {cookies: req.session})
//
app.post('/register', (req, res) => {
  let registerId = generateRandomString();
  let registerEmail = req.body.email;
  let registerPassword = req.body.password;
  let hashedPassword = bcrypt.hashSync(registerPassword, 10);
  // security for password

  if (!registerEmail || !registerPassword) {
    return res.status(400).send('email and password cannot be blank');
  }
  const user = findUserByEmail(registerEmail, users);
  if (user) {
    return res.status(400).send('a user with that email already exists');
  }
  users[registerId] = {
    // add new user at users DB
    id: registerId,
    email: registerEmail,
    password: hashedPassword,
  };
  req.session['user_id'] = registerId; // storing the user id value with cookie session
  // set server username as a cookie
  res.redirect('/urls');
});

//
// POST /logout
//
app.post('/logout', (req, res) => {
  req.session['user_id'] = null;
  res.redirect('/urls');
});

//
// listen
//
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
