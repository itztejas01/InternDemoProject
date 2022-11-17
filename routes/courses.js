const {Course} = require('../models/CourseModel')
const express = require('express')
const bcrypt = require('bcryptjs')
require('dotenv/config')
const decodingToken = require('../helpers/decodingToken')
const router = express.Router()

const store = require('../helpers/multer')


router.get('/',async (req,res)=>{
    // console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)

    let courses

    if(decodedToken.roleType==="admin" || decodedToken.roleType==="superadmin"){
        courses = await Course.find()
    }
    

    if(decodedToken.roleType==="employee"){
        courses = await Course.find({isApproved:true})        
    }

    if(courses.length===0) return res.status(200).send({message:'No Courses Available'})

    
    res.status(200).send(courses)
})


router.post('/add',store.array('files',4), async (req,res)=>{
    // console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)

    let courses

    if(decodedToken.roleType==="employee") return res.status.send({message:'You are not allowed'})
        
    const {courseName,courseDesc,videoUrls,topics,categoryId,duration} = req.body
    // console.log('topic',topics);
    let fileNames = []

    req.files.map(file=>{
        const fileName = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`;
        fileNames.push(fileName)    
    })

    let course 
    
    if(decodedToken.roleType==="admin") {

       course = new Course({
            courseName:courseName,
            courseDescription:courseDesc,
            videoUrl:JSON.parse(videoUrls),
            topicPart:JSON.parse(topics),
            courseItem:fileNames,
            category:categoryId,
            duration:duration,
            isApproved:false,
        })
    }else if(decodedToken.roleType==="superadmin"){
        course = new Course({
            courseName:courseName,
            courseDescription:courseDesc,
            videoUrl:JSON.parse(videoUrls),
            topics:JSON.parse(topics),
            courseItem:fileNames,
            category:categoryId,
            duration:duration,
            isApproved:true,
        })
    }

    course = await course.save()

    if(!course) return res.status(200).send({success:false,message:'Course Cannot be added'})

    
    res.status(200).send({success:true,message:'Course Added Successfully',result:course})
})

module.exports = router