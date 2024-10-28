const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profiles = new Schema({
  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Users"
  },
  company: String,
  website: String,
  location: String,
  status: String,
  skills: [String],
  bio: String,
  experience: String,
  education:String,
  followings:[{
    user:  {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Users"
    }
  }],
  followers:[{
    user:  {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Users"
    }
  }],
  friends:[{
    user:  {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Users"
    },
    date:{
      type: Date,
      default: Date.now
  }
  }],
  friends_request:[{
    user:  {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Users"
    },
    date:{
      type: Date,
      default: Date.now
  }
  }],
  deleted: {
    type : Boolean,
    default : false
  },
  deletedAt: Date
},{
  timestamps :true
})

module.exports=mongoose.model('Profiles', Profiles, 'profiles'); 