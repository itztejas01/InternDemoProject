const { Category } = require('../models/CategoryModel')
const express = require('express')
const bcrypt = require('bcryptjs')
const decodingToken = require('../helpers/decodingToken')
require('dotenv/config')
const router = express.Router()

const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = decodingToken(token)

    const categories = await Category.find();

    if(categories.length===0){
        return res.status(200).json({success: false,message:'No Categories'})
    }

    res.status(200).send(categories)
})



router.get('/:id', async (req, res) => {
    const {id} = req.params
    const categories = await Category.findById(id);



    if(!categories){
        return res.status(200).json({success: false,message:'Category not found'})
    }
    res.status(200).send(categories)    
})


router.post('/add', async (req, res) => {

    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if (decodedToken.roleType === 'employee') return res.send({ message: 'You are not allowed!' })
    
        const {categoryName,categoryDesc} = req.body
    
        let category = new Category({
            categoryName: categoryName,
            categoryDescription: categoryDesc,
        })
    
        category = await category.save();
    
        if(!category) return res.status(400).send({message:'The Category cannot be created!'})
    
    
        res.send({success:true,message:"Category added Successfully",result:category});
    }catch(e){
        res.status(500).send({message:'Please Provide Proper input'});
    }



    
})

router.put('/update', async (req, res) => {

    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if (decodedToken.roleType === 'employee') return res.send({ message: 'You are not allowed!' })
    
        const {categoryId,categoryName,categoryDesc} = req.body
    
        let category = await Category.findByIdAndUpdate(
        categoryId,    
        {
            categoryName: categoryName,
            categoryDescription: categoryDesc,
        },
        {new:true}
        )

        if(!category) return res.status(400).send({message:'The Category cannot be Updated!'})    
        res.send({success:true,message:"Category update Successfully",result:category});
    }catch(e){
        res.status(500).send({message:'Please Provide Proper input'});
    }
})


router.delete('/delete', async (req, res) => {

    try{

        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = decodingToken(token)
    
        if (decodedToken.roleType === 'employee') return res.send({ message: 'You are not allowed!' })
    
        const {categoryId} = req.body
    
        let category = await Category.findByIdAndRemove(categoryId)

        if(!category) return res.status(400).send({message:'The Category cannot be Deleted!'})    

        res.send({success:true,message:'Category Delete Successfully'});
    }catch(e){
        res.status(500).send({message:'Please Provide Proper input'});
    }
})

module.exports = router