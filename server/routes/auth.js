const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const crypto = require('crypto')


router.get('/protect',requireLogin,(req,res)=>{
    return res.send('protected router here...')
})

router.post('/signup',(req,res)=>{
    const {name,email,password} = req.body
    
    if(!name || !email || !password){
        return res.status(422).json({error:'please enter all input field'})
    }
    User.findOne({email:email}).then(userData=>{
        if(userData){
            return res.status(422).json({error:'User already exist with given email.'})
        }

        bcrypt.hash(password,12).then(hashPassword=>{
            const user = new User({
                name,email,password:hashPassword,profilePic:""
            })
            user.save()
            .then(savedUser=>{
                
                if(savedUser){

                    let mailTransporter = nodemailer.createTransport({
                        service:'gmail',
                        auth:{
                            user:'nikhil.punse5@gmail.com',
                            pass:'fomhfgqghgrvexxj'
                        }
                    })

                    let details = {
                        to:user.email,
                        from:'nikhil.punse5@gmail.com',
                        subject:'testing our node mailer',
                        html:'<h1>Welcome to instagram</h1>'
                       }
        
                       mailTransporter.sendMail(details,(err)=>{
                            if(err){
                                console.log('Error occured',err)
                            }else{
                                console.log('Email sended successfuly.')
                            }
                       })

                    res.json({message:'saved successfuly'})
                }
            }).catch(err=>{
                res.json({error:'error in storing user data.'})
                console.log(err)
            })
        })

        
    }).catch(err=>{
        console.log(err)
    })
    
    
})

router.post('/login',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error : 'please fill all inputs.'})
    }
    User.findOne({email:email}).then(userData=>{
        if(!userData){
            return res.status(404).json({error : 'user does not exist with this email.'})
        }
        bcrypt.compare(password,userData.password).then(doMatch=>{
            if(!doMatch){
                return res.status(404).json({error : 'wrong password entered.'})
            }
            const token = jwt.sign({_id:userData._id},SECRET_KEY)
            res.json({token,user:{_id:userData._id,
                            name:userData.name,
                            email:userData.email,
                            followers:userData.followers,
                            following:userData.following,
                            profilePic:userData.profilePic

                        }})
        }).catch(err=>{
            console.log(err)
        })

    }).catch(err=>{
        console.log(err);
    })
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }else{
            const token = buffer.toString('hex')
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    return res.status(422).json({error:'User do not available with this Email.'})
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save()
                .then((result)=>{
                    if(result){
                        let mailTransporter = nodemailer.createTransport({
                            service:'gmail',
                            auth:{
                                user:'nikhil.punse5@gmail.com',
                                pass:'fomhfgqghgrvexxj'
                            }
                        })
    
                        let details = {
                            to:user.email,
                            from:'nikhil.punse5@gmail.com',
                            subject:'Reset your password',
                            html:`<h1>Please click on this <a href=http://localhost:3000/reset/${token}> link </a> to reset your password.</h1>
                                    <h3>Note:- Given link are valide for 1 hour from received time. </h3>`
                           }
            
                           mailTransporter.sendMail(details,(err)=>{
                                if(err){
                                    console.log('Error occured',err)
                                }else{
                                    console.log('Email sended successfuly.')
                                }
                           })
    
                        res.json({message:'Reset link sent on your email.please Check.'})
                    }
                    
                })
            })
        }
    })
})

router.post('/new-password',(req,res)=>{
    const token = req.body.token
    const password = req.body.password

    User.findOne({resetToken:token,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:'Session Expired try again.'})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword=>{
            user.password = hashedPassword
            user.resetToken = undefined
            user.expireToken = undefined
            user.save()
            .then(savedUser=>{
                res.json({message:'password updated successfuly.'})
            })
        })


    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router