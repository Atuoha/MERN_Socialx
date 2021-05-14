const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 const postSchema = new Schema({

    title:{
        type: String
    },

    content:{
        type: String
    },

    likes:[{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],


    comments:[{
        text: String,
        user:{
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        name: String
        
    }],

    file:{
        type: String
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },

    status:{
        type: Boolean,
        default: true
    }
 }, {timestamps: true})


 module.exports = mongoose.model('posts', postSchema)

  


    
