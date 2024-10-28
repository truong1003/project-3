const express = require('express')
const router = express.Router()
const ProfileController = require('../controller/profileController')
const Auth = require('../middleware/authUser')


router.get('/',Auth.requireAuth,ProfileController.Profile)
router.post('/following/:id',Auth.requireAuth,ProfileController.Following)
router.post('/unfollow/:id',Auth.requireAuth,ProfileController.unFollow)
router.post('/friend/:id',Auth.requireAuth,ProfileController.addFriend)
router.post('/unfriend/:id',Auth.requireAuth,ProfileController.unFriend)
router.patch('/acceptFriend/:id',Auth.requireAuth,ProfileController.acceptFriend)
router.post('/create',Auth.requireAuth,ProfileController.Create)
router.delete('/delete',Auth.requireAuth,ProfileController.Delete)
router.patch('/update',Auth.requireAuth,ProfileController.Update)
module.exports = router