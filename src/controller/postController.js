const { text } = require("body-parser")
const Posts = require("../model/Post")
const User = require("../model/User")

module.exports.Create = async function (req,res) {
    const userId= req.user.id
    const newPost = {...req.body,user: userId, name:req.user.fullName}
    const createPost = new Posts(newPost)
    await createPost.save()
    res.status(200).json(createPost)
}

module.exports.Update = async function (req,res) {
    await Posts.updateOne({_id:req.params.id},{...req.body})
    res.status(200).json({message:"Update success"})
}

module.exports.getPost= async function (req,res) {
    const allPost = await Posts.find().sort({date:-1})
    res.status(200).json(allPost)    
}


module.exports.Delete= async function (req,res) {
    const post = await Posts.findById(req.params.id)
    if(!post){
        res.status(400).json({message:"Not find post"})
        return
    }

    if(post.user.toString() !== req.user.id){
        res.status(400).json({message:"User not authorized"})
        return
    }else{
        await post.deleteOne()
        res.status(200).json({message:"delete success"})
    }
    
}

module.exports.Like = async function (req,res) {
    const post = await Posts.findById(req.params.id)
    if(!post){
        res.status(400).json({message:"Not find post"})
        return
    }

    if(post.likes.some(like => like.user.toString() === req.user.id)){
        res.json("User already like post")
        return
    }else{
        const userLike ={
            user:req.user.id,
            name:req.user.fullName
        }

        await post.updateOne({$push:{likes:userLike}})
        res.status(200).json({message:"like success"})
    }

}

module.exports.unLike = async function (req,res) {
    const post = await Posts.findById(req.params.id)

    if(!post){
        res.status(400).json({message:"Not find post"})
        return
    }

    if(!post.likes.some(like => like.user.toString() === req.user.id)){
        res.json("Post has not like")
        return
    }else{
        const userLike ={
            user:req.user.id,
            name:req.user.fullName
        }

        await post.updateOne({$pull:{likes:userLike}})
        res.status(200).json({message:"unlike success"})
    }
}

module.exports.createComment = async function (req,res) {
    const post = await Posts.findById(req.params.id)

    if(!post){
        res.status(400).json({message:"Not find post"})
        return
    }

    const user = await User.findOne({_id:req.user.id})
    if(!user){
        res.status(400).json({message:"Not find user"})
        return
    }

    const newComment = {
        text:req.body.text,
        name: user.fullName,
        user: user.id
    }

    await post.updateOne({$push:{comments:newComment}})
    res.status(200).json({message:"comment success"})
}

module.exports.deleteComment = async function (req,res) {
    const post = await Posts.findById(req.params.id)

    if(!post){
        res.status(400).json({message:"Not find post"})
        return
    }

    const comment = post.comments.find((c) => c._id.toString() === req.params.comment_id )
    if(!comment){
        res.status(400).json({message:"Comment not found"})
        return
    }

    if(comment.user.toString() !== req.user.id){
        res.status(400).json({message:"User not authorized"})
        return
    }   

    await post.updateOne({$pull:{comments:comment}})
    res.status(200).json({message:"Remove comment success"})
}

module.exports.sharePost = async function (req,res) {
    const post = await Posts.findOne({_id:req.params.id})
    
    if(!post){
        res.json("Not find Post")
        return
    }

    if(post.shares && post.shares.some((share)=> share.user.toString() === req.user.id)){
        res.json("Post has share")
        return
    }

    const newShare = {
        user : req.user.id,
        name: req.user.fullName
    }

    await Posts.updateOne({$push:{shares:newShare}})
    res.json("Share success")
}

module.exports.unSharePost = async function (req,res) {
    const post = await Posts.findOne({_id: req.params.id})

    if(!post){
        res.json("Not find Post")
        return
    }

    if(post.shares && !post.shares.some((share) => share.user.toString() === req.user.id)){
        res.json("Post hasn't share")
        return
    }else{
        const userShare = {
            user : req.user.id,
            name: req.user.fullName
        }
    
        await post.updateOne({$pull:{shares:userShare}})
        
        res.json("Delete Share success")
    }

}