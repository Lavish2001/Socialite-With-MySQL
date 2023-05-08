const express = require('express');
const router = express.Router();
const { register, login } = require('../Api_Controllers/registration');


// User Registration

router.route('/registration').post(register);


// User Login

router.route('/login').post(login);

module.exports = router;