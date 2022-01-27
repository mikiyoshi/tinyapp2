const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser'); // npm install body-parser
// const cookieParser = require('cookie-parser'); // npm install cookie-parser
// cookie-parser replace to cookie-session
const cookieSession = require('cookie-session'); // npm install cookie-session
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({ extended: false })); // this is a req.body from each page form value
const bcrypt = require('bcryptjs'); // security for password

app.set('view engine', 'ejs'); // npm install ejs
//
//  MIDDLEWARE
//
app.use(bodyParser.urlencoded({ extended: false })); // this is a req.body from each page form value
// app.use(cookieParser()); // set up cookie-parser
// cookie-parser replace to cookie-session
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
// const urlDatabase = {
//   b2xVn2: 'http://www.lighthouselabs.ca',
//   '9sm5xK': 'http://www.google.com',
// };
//
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

// new user can't use same email in our current users
const findUserByEmail = (email) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
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
  // test cookie-session start
  // req.session.user_id = (req.session.user_id || 0) + 1;

  // Write response
  // res.end(req.session.user_id + ' user_id');
  // test cookie-session end
  // res.send('Hello!');
  res.redirect(`/urls`);
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
  let cookieUser = req.session['user_id'];
  // console.log('GET ID: ', cookieUser);
  // console.log('GET email: ', users[cookieUser];
  const templateVars = {
    user_id: cookieUser,
    // email: users[cookieUser].email, // error
    user: users[cookieUser],
    // shortURL: req.params.shortURL,
    // req.params.shortURL is app.get('/login'
    // longURL: urlDatabase[req.params.shortURL],
    urls: urlDatabase,
  };
  // const templateVars = {
  //   user_id: req.session['user_id'],
  //   urls: urlDatabase,
  // };
  res.render('urls_index', templateVars);
  // res.render is views/urls_index.ejs page template
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
  console.log('GET newID: ', cookieUser);
  console.log('GET newemail: ', users[cookieUser]);
  if (!cookieUser) {
    res.redirect('/login');
  }
  const templateVars = {
    // user_id: cookieUser,
    // email: users[cookieUser].email, // error
    user: users[cookieUser],
    urls: urlDatabase,
  };
  res.render('urls_new', templateVars);
  // res.render is views/urls_new.ejs page template
});

//
// GET /urls/:id
//
// short URL page set up
// https://expressjs.com/en/guide/routing.html#route-parameters  Object parameter set up
app.get('/urls/:shortURL', (req, res) => {
  let cookieUser = req.session['user_id'];
  // console.log('GET shortURLID: ', cookieUser);
  // console.log('GET shortURLemail: ', users[cookieUser]);
  console.log('GET shortURLshortURL: ', req.params.shortURL);
  console.log('GET shortURLlongURL: ', urlDatabase[req.params.shortURL]);
  // shortURL is like a call back function(shortURL){ shortURL()}
  const templateVars = {
    shortURL: req.params.shortURL,
    // req.params.shortURL is :shortURL from app.get('/urls/:shortURL'
    longURL: urlDatabase[req.params.shortURL].longURL,
    /* What goes here? */
    user_id: cookieUser,
    // email: users[cookieUser].email, // error
    user: users[cookieUser],
  };
  res.render('urls_show', templateVars);
  // res.render is views/urls_show.ejs page template
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
  const longURL = urlDatabase[req.params.shortURL].longURL;
  // req.params.shortURL is app.get('/u/:shortURL'
  res.redirect(longURL);
});

//
// POST /urls
//
app.post('/urls', (req, res) => {
  let cookieUser = req.session['user_id'];
  // console.log(req.body); // Log the POST request body to the console
  // res.send('Ok'); // Respond with 'Ok' (we will replace this)
  let shortU = generateRandomString();
  urlDatabase[shortU] = {
    longURL: req.body.longURL,
    userID: cookieUser,
  };
  console.log('POST urls', urlDatabase);
  console.log('POST urls', urlDatabase[shortU]);
  // longURL is urls_new.ejs from input form name="longURL"
  res.redirect(`/urls/${shortU}`);
});

//
// POST /urls/:id
//
// EDIT
app.post('/urls/:shortURL', (req, res) => {
  let shortURL = req.params.shortURL;
  // req.params.id is app.post('/urls/:id'
  console.log('after newURL', req.body);
  console.log('after newLongURL', req.body.newLongURL);
  let newLongURL = req.body.newLongURL;
  // urlDatabase[shortURL] = newLongURL;
  // newLongURL is urls_show.ejs from input form name="newLongURL"
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
    // req.params.shortURL is app.get('/login'
    longURL: urlDatabase[req.params.shortURL],
    // user_id: req.session['user_id'],
    user: users[cookieUser],
  };
  res.render('login', templateVars);
  // res.render is views/login.ejs page template
});

//
// GET /register
//
app.get('/register', (req, res) => {
  let cookieUser = req.session['user_id'];
  const templateVars = {
    shortURL: req.params.shortURL,
    // req.params.shortURL is app.get('/register'
    longURL: urlDatabase[req.params.shortURL],
    // user_id: req.session['user_id'],
    user: users[cookieUser],
  };
  res.render('register', templateVars);
  // res.render is views/register.ejs page template
});

//
// POST /login
//
app.post('/login', (req, res) => {
  let cookieUser = req.session['user_id'];
  // let newUserName = req.body.username;
  // console.log(req.session.username);
  let loginEmail = req.body.email;
  let loginPassword = req.body.password;
  // let hashedPassword = bcrypt.hashSync(loginPassword, 10);
  //
  if (!loginEmail || !loginPassword) {
    return res.status(400).send('email and password cannot be blank');
  }
  const user = findUserByEmail(loginEmail);
  console.log('check users DB', user);
  if (!user) {
    // findUserByEmail() is null
    return res.status(400).send('a user with that email does not exist');
  }
  // if (user.password !== loginPassword) {

  // console.log(
  //   'POST loginPassword: ',
  //   bcrypt.compareSync(loginPassword, user.password)
  // );
  console.log('POST loginUserPassword: ', user.password);
  if (!bcrypt.compareSync(loginPassword, user.password)) {
    // password check bcrypt.compareSync() // true password match, false password not match
    return res.status(400).send('password does not match');
  }
  let loginId = user.id;
  console.log('check login ID', loginId);
  // res.cookie('user_id', loginId);
  req.session['user_id'] = loginId; // storing the user id value with cookie session
  // set server username as a cookie
  // const templateVars = {
  //   user_id: newUserName,
  //   urls: urlDatabase,
  // };
  const templateVars = {
    // user_id: loginId,
    user: users[cookieUser],
    email: loginEmail,
    urls: urlDatabase,
  };
  res.redirect('/urls');
  // res.render('login', templateVars);
});

//
// POST /register
// res.render('home', {cookies: req.session})
//
app.post('/register', (req, res) => {
  let cookieUser = req.session['user_id'];
  let registerId = generateRandomString();
  let registerEmail = req.body.email;
  let registerPassword = req.body.password;
  let hashedPassword = bcrypt.hashSync(registerPassword, 10);
  // security for password

  if (!registerEmail || !hashedPassword) {
    return res.status(400).send('email and password cannot be blank');
  }
  const user = findUserByEmail(registerEmail);
  console.log('check DB', users);
  console.log('check email DB', user);
  if (user) {
    // findUserByEmail() is user
    return res.status(400).send('a user with that email already exists');
  }
  users[registerId] = {
    // add new user at users DB
    id: registerId,
    email: registerEmail,
    password: hashedPassword,
  };
  console.log('Add new user in DB', users);
  const templateVars = {
    // user_id: registerId,
    user: users[cookieUser],
    email: registerEmail,
    urls: urlDatabase,
  };
  // res.cookie('user_id', registerId);
  req.session['user_id'] = registerId; // storing the user id value with cookie session
  // set server username as a cookie
  res.redirect('/urls');
  // ERROR res.redirect can't has 2nd value of templateVars
  // res.render('urls_index', templateVars);
});

//
// POST /logout
//
app.post('/logout', (req, res) => {
  // res.clearCookie('user_id');
  req.session['user_id'] = null;
  // there is a cookie session in your Browser Developer tool of Network, But it's OK.
  // Cos when u login change session, then logout change it too.
  // app.use(
  //   cookieSession({
  //     name: 'session',
  //     keys: [
  //       '40767e34-50b6-489e-81dd-d3883d695663', // Maybe this uuid after logout session as random key
  //       'f62a8200-3854-4f51-81ee-a27ce4d2c01f', // Maybe this uuid after logout session as random key
  res.redirect('/urls');
});

//
// listen
//
// this is always end
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
