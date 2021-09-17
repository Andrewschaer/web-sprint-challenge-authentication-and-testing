const User = require('../users/users-model');

const checkUsernameExists = (req, res, next) => {
    const { username } = req.body
    User.findByUsername(username)
      .then(possibleUser => {
        if (possibleUser.username) {
            next();
        } else {
          next({ status: 401, message: 'Invalid credentials'});
        }
      })
      .catch(next);
  }

const checkUsernameFree = (req, res, next) => {
    const { username } = req.body
    User.findByUsername(username)
      .then(possibleUser => {
        if (possibleUser === undefined) {
            next();
        } else {
            next({ status: 422, message: 'username taken'});
        }
      })
      .catch(next);
}

const validateNewUser = (req, res, next) => {
    if (!req.body.username ||
        req.body.username === undefined ||
        req.body.username === null ||
        !req.body.password || 
        req.body.password === undefined ||
        req.body.password === null) {
        next({ status: 422, message: 'username and password required'});
    } else { 
        next();
    }
}

module.exports = { checkUsernameExists, checkUsernameFree, validateNewUser }