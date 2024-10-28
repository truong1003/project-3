const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Conversations = new Schema({
    user1:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    user2:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    recent_date:{
        type: Date,
        default: Date.now
    },
    message:[{
        from:{
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        to:{
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        read:{
            type: Boolean,
            default: false
        },
        date:{
            type: Date,
            default: Date.now
        },
        show_on_from:{
            type: Boolean,
            default: true
        },
        show_on_to:{
            type: Boolean,
            default: true
        },
        text:{
            type: String,
            require: true 
        }
    }]
},{
  timestamps :true
})

module.exports=mongoose.model('Conversations', Conversations, 'conversations'); 