const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req,res,next)=>{
    const token = req.headers.authorization
    if(!token){
        return res.status(401).json({error:'you must loggin.'})
    }
    jwt.verify(token,SECRET_KEY,(err,payload)=>{
        if(err){
            return res.status(401).json({error:'you must loggin.'})
        }
        const _id = payload._id
        User.findById(_id).then(userData=>{
            req.user = userData
            next()
        })
        
    })
}