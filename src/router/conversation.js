const express = require('express')
const router = express.Router()
const conversationsController = require('../controller/conversationController')
const Auth = require('../middleware/authUser')

router.get("/",Auth.requireAuth,conversationsController.getConversation)
router.post("/",Auth.requireAuth,conversationsController.sendMessage)

module.exports = router