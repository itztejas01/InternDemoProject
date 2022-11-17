const {User} = require('../models/UserModel')
const express = require('express')
const bcrypt = require('bcryptjs')
require('dotenv/config')
const router = express.Router()

const jwt = require('jsonwebtoken');


router.get('/',async (req,res)=>{
    const userList = await User.find().select('-passwordHash')

    if(userList.length === 0){
        res.status(200).json({success:false,message:'No user there'})
        return
    }
    res.send(userList)
})

router.get('/:id',async (req,res)=>{
    try{
        
        const user = await User.findById(req.params.id).select('-passwordHash')
        if(!user){
            res.status(200).json({success:false,message:'The user with the given ID was not found.'})
            return
        }
        res.send(user)
    }catch(e){
        res.status(500).send({success:false,message:'Some Parameter are wrong'})
        console.log(e);
    }
})

router.post('/register',async (req,res)=>{
    // console.log(req.body);
    const {name,userName,password,phone,userType} = req.body
    // console.log('name',name);
    const user = await User.find({username:userName})
    // console.log(user.length);
    if(user.length===0){
        const hashPassword = bcrypt.hashSync(password,12)
        let newUser = new User({
            name:name,
            username:userName,
            passwordHash:hashPassword,
            phone:phone,
            role: userType ? userType.toLowerCase() :'employee'
        })
        newUser = await newUser.save();

        if(!newUser){
            return res.status(400).status({success:false,message:'User cannot be created'})
        }
        res.send(newUser)
        // res.send({success:false,message:'USER Not EXIST'}) 
    }else{
        return res.send({success:false,message:'USER ALREADY EXIST'})
    }
    
})

router.post('/signIn',async (req,res)=>{
    const {userName,password} = req.body
    const secret = process.env.JWT_SECRET

    const user = await User.findOne({username:userName})
    
    if(!user) return res.send({success:false,message:"User not exist"})

    if(user && bcrypt.compareSync(password,user.passwordHash)){
        const token = jwt.sign(
            {
                userId:user._id,
                roleType:user.role
            },
            secret,
            {expiresIn:'1m'}
        )
        res.status(200).send({success:true,message:{userName:user.username,token:token}})
    }else return res.send({success:false,message:"Password is wrong"})

})


module.exports = router