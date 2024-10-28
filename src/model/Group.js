const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Groups = new Schema({
  name: String,
  description: String,
  code: String,
  members:[
    {
      user:{
          type: mongoose.Schema.Types.ObjectId,
      },
      join_date: {
        type : Date,
        default: Date.now
      }
    }
  ],
  members_request:[{
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    request_date: {
      type : Date,
      default: Date.now
    }
  }],
  manager:[{
    user:{
        type: mongoose.Schema.Types.ObjectId
    },
    role:{
        type: String,
        enum:['admin','mod'],
        default: 'admin'
    }
  }],
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Users"
  },

  date:{
    type: Date,
    default: Date.now
  }
},{
  timestamps :true
})

module.exports=mongoose.model('Groups', Groups, 'groups'); 