const { Router } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model('Post')

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id}).populate('postedBy','_id name')
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>console.log('error :' + err))
})

router.get('/allpost',(req,res)=>{
    Post.find().populate('postedBy','_id name')
    .populate('comments.postedBy','_id name')
    .sort('-createdAt')
    .then(userpost=>{
       return res.json({userpost})
    }).catch(err=>{
        console.log(err);
    })
})

router.get('/followingspost',requireLogin,(req,res)=>{

    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy','_id name')
    .populate('comments.postedBy','_id name')
    .sort('-createdAt')
    .then(userpost=>{
       return res.json({userpost})
    }).catch(err=>{
        res.json({error:err})
        console.log(err)
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
        const {title,body,pic} = req.body
        if(!title || !body || !pic){
            return res.status(401).json({error:"please fill all fields."})
        }
        req.user.password = undefined
        const post = new Post({
            title,
            body,
            pic,
            postedBy:req.user
        })
        post.save()
        .then(result=>{res.json({result})})
        .catch(err=>{
            console.log(err)
        })
    })    

    router.put('/like',requireLogin,(req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{likes:req.user._id}
        },{
            new:true
        })
        .populate('comments.postedBy','_id name')
        .populate('postedBy','_id name')
        .exec((err,result)=>{
            if(err){
               return  res.status(422).json({error:err})
            }else{
                res.json({result})
            }
        })
    })

    router.put('/unlike',requireLogin,(req,res)=>{
        Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likes:req.user._id}
        },{
            new:true
        })
        .populate('comments.postedBy','_id name')
        .populate('postedBy','_id name')
        .exec((err,result)=>{
            if(err){
               return  res.status(422).json({error:err})
            }else{
                res.json({result})
            }
        })
    })
    
    router.put('/comment',requireLogin,(req,res)=>{
        const comment = {text:req.body.text,
            postedBy:req.user._id
        }
        Post.findByIdAndUpdate(req.body.postId,{
            $push:{'comments':comment}
        },{
            new:true
        })
        .populate('comments.postedBy','_id name')
        .populate('postedBy','_id name')
        .exec((err,result)=>{
            if(err){
                console.log(err)
               return res.status(422).json(err)
            }else{
                res.json({result})
            }
        })
    })

    router.delete('/deletepost',requireLogin,(req,res)=>{
        Post.findByIdAndDelete(req.body.postId)
        .populate('postedBy','_id name')
        .exec((err,result)=>{
            if(err){
                return res.status(422).json({'error':err})
            }else{
                res.json({result})
            }
        })
    })

module.exports = router