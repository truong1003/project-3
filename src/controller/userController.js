const User = require('../model/User')
const md5 = require('md5');

module.exports.AllUser = async function (req,res){
    const user = await User.find({deleted: false})
    res.json(user)
} 

module.exports.RegUse = async function (req,res,next){
    try {
        const fullName = req.body.fullName
        const email = req.body.email
        const password = req.body.password

        const user = new User({fullName:fullName,email:email,password:md5(password)})
        await user.save()
        res.status(201).json(user)
    } catch (error) {
        next(error)
    }
    
}

module.exports.Detail= async function (req,res) {
    const userDetail = await User.findOne({_id:req.params.id})
    res.json(userDetail)
}

module.exports.Update = async function (req,res) {
    try {
        await User.updateOne({_id:req.params.id},req.body)
        res.status(200).json({message:"Success"})
    } catch (error) {
        
    }
}


module.exports.Login = async function (req,res) {
    const email=req.body.email
    const password=req.body.password

    const user= await User.findOne({
        email:email
    })

    if(!user){
        res.jon({message:"not find user"})
        return
    }

    if(md5(password) != user.password){
        res.json({message:"password incorrect"})
        return
    }

    if(user.status=="inactive"){
        res.json({message:"user not active"})
        return
    }

    res.cookie("tokenUser",user.tokenUser)
    res.status(200).json(user.tokenUser)

}