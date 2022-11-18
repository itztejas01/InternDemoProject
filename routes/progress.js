const {CourseInfo} = require('../models/CourseInfoModel')
const express = require('express')
require('dotenv/config')
const decodingToken = require('../helpers/decodingToken')

const router = express.Router()

router.get('/',async (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)
    
    // if(decodedToken.roleType==="employee") return res.status.send({message:'You are not allowed'})
    
    let allProgress = await CourseInfo.find().populate('userWatch','-passwordHash').populate('courseName')
    
    if(allProgress.length === 0) return res.status(200).send({success:false,message:'No progress'})

    
    res.status(200).send({success:true,message:'All Progress',result:allProgress})
    // console.log('decodedToken',decodedToken);
})



router.get('/:courseId',async (req,res)=>{
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)

    const {courseId} = req.params

    const progress = await CourseInfo.find({courseName:courseId}).populate('userWatch','-passwordHash').populate('courseName')

    if(!progress) return res.status(200).send({success:false,message:'No progress found'})


    res.status(200).send({success:true,message:'All Progress',result:progress})
    // console.log('decodedToken',decodedToken);
})

router.post('/add',async (req,res)=>{

    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        const {courseId,courseProgress} = req.body
    
        let progress = new CourseInfo({
            courseName:courseId,
            userWatch:decodedToken.userId,
            courseProgress:courseProgress
        })
        progress = await progress.save()
    
        if(!progress) return res.status(200).send({success:false,message:'Course Progress Added'})
    
        
        res.status(200).send({success:true,message:'Course Progress Added',result:progress})
    }catch(e){
        res.status(501).send({success:false,message:'Please input proper parameter!'})
    }
    // console.log('decodedToken',decodedToken);
})


module.exports= router