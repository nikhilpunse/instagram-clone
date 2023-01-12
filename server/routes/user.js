const { Router, json } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/user',requireLogin,(req,res)=>{
     User.findById(req.user._id)
     .select('-password')
     .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        res.json({user:result})
     })
})

router.post('/profilepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{profilePic:req.body.picUrl},
        {new:true})
    .then(output=>
        res.json({output})
        )
    .catch(err=>{
        res.status(422).json({error:err})
        console.log('error :' +err)
    })
})

router.post('/searchemails', (req,res)=>{
    let userPattern = new RegExp("^" + req.body.searchItem)
    User.find({email:{$regex:userPattern}})
    .select('-password')
    .then(user=>
        res.json({user})
    ).catch(err=>console.log(err))
})

//userProfile api for other user Data
router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select('-password')
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate('postedBy','_id name')
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    })
    .catch(err=>{
        return res.status(404).json({result:'user not found.'})
    })

    
})

// followers following api
router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.userId,{
        $push:({followers:req.user._id})
    },{
        new:true
    })
    .select('-password')
    .then(followers=>{
        User.findByIdAndUpdate(req.user._id,{
            $push:({following:req.body.userId})
        },{
            new:true
        })
        .exec((err,myFollowing)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            return res.json({followers})
        })
    })
    .catch(err=>{
        return res.status(404).json({error:err})
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.userId,{
        $pull:({followers:req.user._id})
    },{
        new:true
    })
    .select('-password')
    .then(followers=>{
        User.findByIdAndUpdate(req.user._id,{
            $pull:({following:req.body.userId})
        },{
            new:true
        })
        .exec((err,myFollowing)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({followers})
        })
    })
    .catch(err=>{
        return res.status(404).json({error:err})
    })
})

module.exports = router