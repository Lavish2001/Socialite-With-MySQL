const express = require('express');
const router = express.Router();
const { allUsers, updateUser, changePassword, singleUser } = require('../Api_Controllers/user_controller');


// Get All Users

router.route('/allusers').get(allUsers);


// Update User Details

router.route('/update').patch(updateUser);


// Change User Password

router.route('/changepassword').patch(changePassword)


// Get Selected User Details

router.route('/singleuser').get(singleUser)



module.exports = router;