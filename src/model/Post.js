const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Posts = new Schema({
  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref:"Users"
  },
  text: String,
  name: String,
  likes: [
    {user:{
        type: mongoose.Schema.Types.ObjectId
    },
    name : String
  }
  ],
  comments: [{
    user: {
        type: mongoose.Schema.Types.ObjectId
    },
    text: {
        type: String
    },
    name:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    }
  }],
  shares: [
    {user:{
        type: mongoose.Schema.Types.ObjectId
    },
    name : String
  }
  ],
  date:{
    type: Date,
    default: Date.now
  }
},{
  timestamps :true
})

module.exports=mongoose.model('Posts', Posts, 'posts'); 