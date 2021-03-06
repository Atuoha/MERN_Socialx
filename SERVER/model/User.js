const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
   
const userSchema = new Schema({
    name:{
        type: String
    },

    email:{
        type: String
    },

    password:{
        type: String
    },

    reset_token:{
        type: String
    },

    token_expires:{
        type: Date
    },

    profile_image:{
        type: String
    },

    following:[{
        type: String
    }],

    followers:[{
        type: String
    }]
})    

module.exports = mongoose.model('users', userSchema)