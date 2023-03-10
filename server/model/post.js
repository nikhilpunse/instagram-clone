const mongoose =require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const User = mongoose.model('User')
const postSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        required:true
    },
    likes:[{type:ObjectId,ref:'User'}],
    comments:[{
            text:{type:String,required:true},
            postedBy:{
                type:ObjectId,
                ref:'User'
            }
    }],
    postedBy:{
        type:ObjectId,
        ref:'User'
    }
},{ timestamps: true})

module.exports = mongoose.model('Post',postSchema)