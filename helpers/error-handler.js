function errorhandler (err,req,res,next){
    if(err.name==="UnauthorizedError"){
        return res.status(400).json({message:'Please Login to contiue'})
    }

    console.log('err',err);
    if(err.name==="ValidationError"){
        return res.status(401).json({message:err})
    }

    return res.status(500).json(err)
}

module.exports = errorhandler;