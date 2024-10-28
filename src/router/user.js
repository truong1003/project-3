const express = require('express')
const router = express.Router()
const UserController = require('../controller/userController')

router.get('/',UserController.AllUser)
router.post('/reg',UserController.RegUse)
router.get('/detail/:id',UserController.Detail)
router.patch('/update/:id',UserController.Update)
router.post('/login',UserController.Login)
module.exports = router