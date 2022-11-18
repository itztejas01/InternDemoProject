const {Course} = require('../models/CourseModel')
const express = require('express')
require('dotenv/config')
const decodingToken = require('../helpers/decodingToken')

const router = express.Router()
const store = require('../helpers/multer')


router.get('/',async (req,res)=>{
    // console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)

    let courses
    let filter = {}

    if(req.query.categories){
        filter = {category:req.query.categories.split(',')}
    }

    if(decodedToken.roleType==="admin" || decodedToken.roleType==="superadmin"){
        courses = await Course.find(filter).populate('category')
    }
    
    // console.log('req.qeryu',req.query);

    if(decodedToken.roleType==="employee"){
        courses = await Course.find({...filter,isApproved:true}).populate('category')
    }

    if(courses.length===0) return res.status(200).send({message:'No Courses Available'})

    
    res.status(200).send(courses)
})


router.post('/add',store.array('files',4), async (req,res)=>{
    // console.log(req.headers)
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)

    
    let course 

    if(decodedToken.roleType==="employee") return res.status.send({message:'You are not allowed'})
        
    const {courseName,courseDesc,videoUrls,topics,categoryId,duration} = req.body
    // console.log('topic',topics);
    let fileNames = []

    req.files.map(file=>{
        const fileName = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`;
        fileNames.push(fileName)    
    })

    
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



router.put('/superadmin/update', async (req,res)=>{
    // console.log(req.headers)
    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if(decodedToken.roleType==="employee" || decodedToken.roleType==="admin") return res.status(500).send({message:'You are not allowed'})
        // else if(decodedToken.roleType==="admin") return res.status.send({message:'You are not allowed'})
        
        const {courseId,isApproved} = req.body    
        
        let course
        
        course = await Course.findByIdAndUpdate(courseId,{
            isApproved:isApproved,
        },
        {new:true}
        )
        
    
        if(!course) return res.status(200).send({success:false,message:'Course Cannot be updated by superadmin'})
    
        
        res.status(200).send({success:true,message:'Course Updated Successfully',result:course})
    }catch(e){
        console.log(e);
        return res.status(200).send({success:false,message:'Please Provide Proper input'})
    }
})


router.put('/admin/course/item/update',store.single('file'), async (req,res)=>{
    // console.log(req.headers)
    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if(decodedToken.roleType==="employee") return res.status(500).send({message:'You are not allowed'})
        
        let course
        
        const {courseId} = req.body
        let file = req.file
        let filename
        
        if(file){
            filename = `${req.protocol}://${req.get('host')}/public/uploads/${file.filename}`

            course = await Course.findByIdAndUpdate(courseId,{
                $addToSet:{
                    courseItem:filename
                },
                isApproved:false
            })
        }
        
    
        if(!course) return res.status(200).send({success:false,message:'Course Cannot be updated by admin'})
    
        
        res.status(200).send({success:true,message:'Course Updated Successfully'})
    }catch(e){
        console.log(e);
        return res.status(200).send({success:false,message:'Please Provide Proper input'})
    }
})

router.put('/admin/course/item/delete',store.single('file'), async (req,res)=>{
    // console.log(req.headers)
    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if(decodedToken.roleType==="employee") return res.status(500).send({message:'You are not allowed'})
        
        let course
        
        const {courseId,duration,categoryId,deleteFilename} = req.body

        course = await Course.findByIdAndUpdate(courseId,{
            category:categoryId && categoryId,
            duration:duration && duration,
            $pull:{
                courseItem:deleteFilename
            },
            isApproved:false
        })
        
        if(!course) return res.status(200).send({success:false,message:'Course Cannot be Deleted by admin'})
    
        
        res.status(200).send({success:true,message:'Course Deleted Successfully'})
    }catch(e){
        console.log(e);
        return res.status(200).send({success:false,message:'Please Provide Proper input'})
    }
})


router.delete('/admin/course/delete', async (req,res)=>{
    // console.log(req.headers)
    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if(decodedToken.roleType==="employee") return res.status(500).send({message:'You are not allowed'})
        
        let course
        
        const {courseId} = req.body

        course = await Course.findByIdAndRemove(courseId)
        
        if(!course) return res.status(400).send({success:false,message:'Course Cannot be Deleted by admin'})
    
        
        res.status(200).send({success:true,message:'Course Deleted Successfully'})
    }catch(e){
        console.log(e);
        return res.status(200).send({success:false,message:'Please Provide Proper input'})
    }
})


module.exports = router