const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/jwt')
const User = require('../model/User')


module.exports = (req, res, next)=>{
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "Login to access feature"})
    }

    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, JWT_SECRET, (err, payload)=>{
        if(err){
            return res.status(401).json({error: "Login to access feature"})
        }

        const {_id} = payload
        User.findById(_id)
        .then(user=>{
            req.user = user
        })

        next()
    })



    

}