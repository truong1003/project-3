const express = require("express")
const router = express.Router()
const Auth = require("../middleware/authUser")
const postController = require("../controller/postController")

router.get("/",postController.getPost)
router.post("/create",Auth.requireAuth,postController.Create)
router.patch("/update/:id",Auth.requireAuth,postController.Update)
router.delete("/delete/:id",Auth.requireAuth,postController.Delete)
router.post("/like/:id",Auth.requireAuth,postController.Like)
router.patch("/unlike/:id",Auth.requireAuth,postController.unLike)
router.post("/comments/:id",Auth.requireAuth,postController.createComment)
router.delete("/uncomments/:id/:comment_id",Auth.requireAuth,postController.deleteComment)
router.post("/share/:id",Auth.requireAuth,postController.sharePost)
router.patch("/unshare/:id",Auth.requireAuth,postController.unSharePost)

module.exports = router