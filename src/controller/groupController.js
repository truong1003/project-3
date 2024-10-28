const Group = require('../model/Group')
const User = require('../model/User')

module.exports.createGroup = async function (req,res) {
    const existGroup = await Group.find({$or:[{name: req.body.name},{code:req.body.code}]})
    if(existGroup.length > 0){
        return res.json("Đã tồn tại tên nhóm")
    }

    const newGroup = {creator: req.user._id,...req.body}
    const createGroup = new Group(newGroup)
    await createGroup.save()
    res.json("Tạo thành công")
}

module.exports.getGroup = async function (req,res) {
    const groups = await Group.find()
    res.status(200).json(groups)
}

module.exports.updateGroup = async function (req,res) {
    const groupId = req.params.id
    const group = await Group.findOne({_id:groupId})
    if(!group){
        return res.json("Không tìm thấy nhóm")
    }

    const existGroup = await Group.find({
        $and:[
        {$or:[{name:req.body.name},{code:req.body.code}]},
        {_id: {$ne:groupId}}
    ]})

    if(existGroup.length >0 ){
        return res.json("Đã tồn tại tên nhóm")
    }

    await Group.updateOne({_id:groupId},req.body)
    res.json("Update success")
}

module.exports.deleteGroup = async function (req,res) {
    await Group.deleteOne({_id:req.params.id})
    res.json("Delete success")
}

module.exports.joinGroup = async function (req,res) {
    const group = await Group.findOne({_id:req.params.id})
    if(!group){
        return res.json("Không tìm thấy nhóm")
    }

    if(group.members_request && group.members_request.some(user => user.user.toString() === req.user.id.toString())){
        return res.json("Bạn đã gửi yêu cầu")
    }

    if(group.members && group.members.some(user => user.user.toString() === req.user.id)){
        return res.json("Bạn đã ở trong nhóm")
    }

    await group.updateOne({$push:{members_request:{user:req.user.id}}})
    res.status(200).json("Đã gửi yêu cầu")
}

module.exports.acceptJoin = async function (req,res) {
    const group = await Group.findOne({_id:req.params.id})
    if(!group){
        return res.json("Không tìm thấy nhóm")
    }

    if(group.members_request && !group.members_request.some(user => user.user.toString() === req.user.id.toString())){
        return res.json("Không có yêu cầu nào")
    }

    await Group.updateOne({_id:req.params.id},{
        $push:{members:{user:req.user.id}},
        $pull:{members_request:{user:req.user.id}}
    })
    res.json("Chấp nhận vào nhóm")
}

module.exports.unacceptJoin = async function (req,res) {
    const group = await Group.findOne({_id:req.params.id})
    if(!group){
        return res.json("Không tìm thấy nhóm")
    }

    if(group.members_request && !group.members_request.some(user => user.user.toString() === req.user.id.toString())){
        return res.json("Không có yêu cầu nào")
    }

    await group.updateOne({$pull:{members_request:{user:req.user.id}}})
    res.json("Từ chối vào nhóm")
}

module.exports.addManager = async function (req,res) {
    const group = await Group.findOne({_id:req.params.id})

    if(!group){
        return res.json("Không tìm thấy group")
    }

    if(group.manager && group.manager.some(manager => manager.user.toString() === req.body.user)){
        return res.json("Đã là Manager")
    }

    const allowedRoles = ['admin', 'mod'];

    if (!allowedRoles.includes(req.body.role)) {
    return res.status(400).json({ error: "Role không hợp lệ" });
    }

    await group.updateOne({$push:{manager:req.body}})
    res.json("Success")
}

module.exports.removeManager = async function (req,res) {
    const group = await Group.findOne({_id:req.params.group_id})

    if(!group){
        return res.json("Không tìm thấy group")
    }

    if(group.manager && !group.manager.some(manager => manager.user.toString() === req.params.user_id)){
        return res.json("Không phải manager")
    }

    await group.updateOne({$pull:{manager:{user:req.params.user_id}}})
    res.json("Remove Success")
}

module.exports.getMembers = async function (req,res) {
    const group = await Group.findOne({_id:req.params.id})

    if(!group){
        return res.json("Không tìm thấy group")
    }
    
    const userId = group.members.map(user => user.user)
    console.log(userId)
    const user =await User.find({_id:{$in:userId}}).select("-password -tokenUser")

    res.json(user)
}

module.exports.removeMember = async function (req,res) {
    const group = await Group.findOne({_id:req.params.group_id})

    if(!group){
        return res.json("Không tìm thấy group")
    }

    if(group.members && !group.members.some(members => members.user.toString() === req.params.user_id)){
        return res.json("Không phải là member")
    }

    if(group.members.length == 1){
        return res.json("Bạn là thành viên duy nhất nên không thể xóa")
    }

    await group.updateOne({$pull:{members:{user:req.params.user_id}}})
    res.json("Remove Success")
}