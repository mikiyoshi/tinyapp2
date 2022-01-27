// new user can't use same email in our current users
function findUserByEmail(email, users) {
  // Refactor Helper Functions from findUserByEmail() of express_server.js
  // console.log('helper.js: ', users); // key and value
  console.log('helper.js email: ', email); // only value
  console.log('helper.js users: ', Object.values(users)); // only value
  let usersArr = Object.values(users);
  for (const userId in usersArr) {
    const user = usersArr[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

module.exports = { findUserByEmail };
