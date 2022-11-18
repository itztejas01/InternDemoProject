const express = require('express') 
const app = express()
const cors = require('cors');
const store = require('./helpers/multer')
const authJwt = require('./helpers/jwt');
const mongoose = require('mongoose')
require('dotenv/config');
const errorhandler = require('./helpers/error-handler');



app.use(cors())
app.options('*',cors())

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(authJwt())
// app.use(store.array('files'))

app.use(express.static('./public/uploads'))
app.use(errorhandler)

const userRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const categoryRoutes = require('./routes/categories');
const progressRoutes = require('./routes/progress');


const api_url= process.env.API_URL

app.use(`${api_url}/users`,userRoutes)
app.use(`${api_url}/course`,coursesRoutes)
app.use(`${api_url}/category`,categoryRoutes)
app.use(`${api_url}/progress`,progressRoutes)



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