const express = require('express');
const router = express.Router();
const { startMessage, getChats, readMessages } = require('../Api_Controllers/message_controller');


// Send Messages

router.route('/message').post(startMessage);



// Get User Chats and Last Message

router.route('/chats').get(getChats);



// Read Messages From Uses

router.route('/read').get(readMessages)


module.exports = router;