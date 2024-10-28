const { text } = require('body-parser')
const Conversations = require('../model/Conversation')
const User = require('../model/User')
module.exports.sendMessage =async function (req,res) {
    const toUser = await User.findById(req.body.to)
    if(!toUser){
        return res.json("Không tìm thấy người nhận")
    }

    if(!req.body.conversationsId){
        let existConversation = await Conversations.findOne({
            $or:[
                {
                    $and:[{user1: req.user.id},{user2:req.body.to}]
                },
                {
                    $and:[{user1:req.body.to},{user2:req.user.id}]
                }
            ]
        })

        if(existConversation){
            await existConversation.updateOne({$push:{message:{
                from: req.user.id,
                to: req.body.to,
                text:req.body.text
            }}})
        }else{
            existConversation = new Conversations({
                user1:req.user.id,
                user2:req.body.to,
                message:{
                    from:req.user.id,
                    to:req.body.to,
                    text:req.body.text
                }
            })
        }

        await existConversation.save()
        return res.json(existConversation)
    }else{
        const conversation = await Conversations.findOne({_id:req.body.conversationsId})  

        if(!conversation){
        return res.json("Không tìm thấy")
        }

        if((conversation.user1 !== req.user.id && conversation.user2 !== req.body.to) ||
        (conversation.user1 !== req.body.to && conversation.user2 !== req.user.id)){
            return res.json("Lỗi người dùng")
        }

        await conversation.updateOne({$push:{message:{
            from: req.user.id,
            to: req.body.to,
            text:req.body.text
        }}})

        res.json(conversation)
    }
}

module.exports.getConversation = async function (req,res) {
    const conversation = await Conversations.find({$or:[{user1:req.user.id},{user2:req.user.id}]})
    res.json(conversation)
}