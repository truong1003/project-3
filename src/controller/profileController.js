const Profile = require("../model/Profile")
const User = require('../model/User')


module.exports.Profile= async function (req,res) {
    const userId = req.user._id
    const User = await Profile.findOne({user:userId}).populate('user',["fullName"])
    res.status(200).json(User)
}

module.exports.Create= async function (req,res) {
    const userId = req.user._id
    const profileUser={...req.body,user:userId}
    const profile = new Profile(profileUser)
    await profile.save()
    res.status(200).json({message:"Create success"})
}

module.exports.Delete= async function (req,res) {
    const userId = req.user._id
    await Profile.deleteOne({user:userId})
    res.status(200).json("Delete Success")
}

module.exports.Update= async function (req,res) {
    const userId = req.user._id
    await Profile.updateOne({user:userId},req.body)
    res.status(200).json("Update Success")
}

module.exports.Following = async function (req, res) {
    const fromProfile = await Profile.findOne({ user: req.user._id });
    const toProfile = await Profile.findOne({ user: req.params.id });
    
    if (fromProfile.followings && fromProfile.followings.some(follower => follower.user.toString() === req.params.id)) {
        return res.json("Bạn đã follow");
    }

    if (toProfile.followers && toProfile.followers.some(follower => follower.user.toString() === req.user._id.toString())) {
        return res.json("Người này đã follow bạn");
    }

    await fromProfile.updateOne({ $push: { followings: { user: req.params.id } } });
    await toProfile.updateOne({ $push: { followers: { user: req.user._id } } });

    return res.status(200).json("Follow success");
}

module.exports.unFollow = async function (req, res) {
    const fromProfile = await Profile.findOne({ user: req.user._id });
    const toProfile = await Profile.findOne({ user: req.params.id });

    if (fromProfile.followings && !fromProfile.followings.some(follower => follower.user.toString() === req.params.id)) {
        return res.json("Bạn chưa follow");
    }

    if (toProfile.followers && !toProfile.followers.some(follower => follower.user.toString() === req.user._id.toString())) {
        return res.json("Người này chưa được bạn follow");
    }

    await fromProfile.updateOne({ $pull: { followings: { user: req.params.id } } });
    await toProfile.updateOne({ $pull: { followers: { user: req.user._id } } });

    return res.status(200).json("Unfollow success");
}

module.exports.addFriend = async function (req,res) {
    const fromProfile = await Profile.findOne({ user: req.user._id });
    const toProfile = await Profile.findOne({ user: req.params.id });

    if(toProfile.friends && toProfile.friends.some(friend => friend.user.toString === req.user._id.toString())){
        return res.json("Người này đã là bạn bè")
    }

    if(fromProfile.friends_request && fromProfile.friends_request.some(friend => friend.user.toString() === req.params.id)){
        return res.json("Bạn đã gửi lời kết bạn")
    }

    await toProfile.updateOne({$push:{friends_request: {user: req.user._id}}})
    res.status(200).json("Gửi lời kết bạn thành công")
}

module.exports.unFriend = async function (req,res) {
    const fromProfile = await Profile.findOne({ user: req.user._id });
    const toProfile = await Profile.findOne({ user: req.params.id });

    if(toProfile.friends && !toProfile.friends.some(friend => friend.user.toString() === req.user._id.toString())){
        return res.json("Bạn chưa trở thành bạn bè với người này")
    }

    await fromProfile.updateOne({ $pull: { friends: { user: req.params.id } } });
    await toProfile.updateOne({ $pull: { friends: { user: req.user._id } } });

    return res.status(200).json("Unfriend success");
}

module.exports.acceptFriend = async function (req,res) {
    const currentProfile = await Profile.findOne({user:req.user._id})
    const requestProfile = await Profile.findOne({user:req.params.id})
    
    if(currentProfile.friends && currentProfile.friends.some(friend => friend.user.toString() === req.params.id)){
        return res.json("Người này đã là bạn bè")
    }

    if(currentProfile.friends_request && !currentProfile.friends_request.some(friend => friend.user.toString() === req.params.id)){
        return res.json("Không có yêu cầu kết bạn")
    }

    if(requestProfile.friends && requestProfile.friends.some(friend => friend.user.toString() === req.user._id.toString())){
        return res.json("Bạn đã là bạn bè")
    }

    await currentProfile.updateOne({$pull:{friends_request:{user: req.params.id}}})
    await currentProfile.updateOne({$push:{friends:{user: req.params.id}}})
    await requestProfile.updateOne({$push:{friends:{user: req.user._id}}})

    res.status(200).json("Chấp nhận kết bạn")
}