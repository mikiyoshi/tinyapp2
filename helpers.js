// new user can't use same email in our current users
function findUserByEmail(email, users) {
  let usersArr = Object.values(users);
  for (const userId in usersArr) {
    const user = usersArr[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

// global scope
function generateRandomString() {
  var random = Math.random().toString(36).slice(7);
  return random;
}
module.exports = { findUserByEmail, generateRandomString };
