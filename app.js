const express = require('express') 
const app = express()
const cors = require('cors');
var multer = require('multer');
var upload = multer();
require('dotenv/config');
const mongoose = require('mongoose')
app.use(cors())
app.options('*',cors())


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(upload.array())
app.use(express.static('./public/uploads'))

const userRoutes = require('./routes/users')

const api_url= process.env.API_URL

app.use(`${api_url}/users`,userRoutes)



mongoose.connect(process.env.MONGOOSE_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:'project'
})
.then(()=>{
    console.log('Connection is ready');
})
.catch(err=>{
    console.log('error in database',err);
})

app.listen(5000,()=>{
    console.log('server is listening on http://localhost:5000');
})