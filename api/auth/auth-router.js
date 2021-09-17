const router = require('express').Router();
const { checkUsernameExists, checkUsernameFree, validateUser } = require('./auth-middleware')
const tokenBuilder = require('./token-builder');
const bcrypt = require('bcryptjs');
const User = require('../users/users-model');


router.post('/register', validateUser, checkUsernameFree, (req, res, next) => {
  let user = req.body;
  const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
  const hash = bcrypt.hashSync(user.password, rounds);
  user.password = hash

  User.add(user)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(next);
});

router.post('/login', validateUser, checkUsernameExists, (req, res, next) => {
  let { password } = req.body;
  const user = req.body.foundUser
  
  if (bcrypt.compareSync(password, user.password)) {
    const token = tokenBuilder(user)
    res.status(200).json({
      message: `welcome, ${user.username}`,
      token,
    });
  } else {
    next({ status: 401, message: 'invalid credentials' });
  }
});

module.exports = router;
