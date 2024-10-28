const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const genaration = require('../helper/genaration.js');


const Users = new Schema({
  fullName:  String,
  email: String,
  password: {
    type: String,
    minLength: 5
  },
  tokenUser: {
    type: String,
    default : genaration.generateRandomString(20)
  },
  avatar: String,
  deleted: {
    type : Boolean,
    default : false
  },
  deletedAt: Date
},{
  timestamps :true
})

module.exports=mongoose.model('Users', Users, 'users'); 