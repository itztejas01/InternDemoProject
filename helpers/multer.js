const multer = require('multer');

// set storage
var storage = multer.diskStorage({
    destination : function ( req , file , cb ){
        cb(null, 'public/uploads')
    },
    filename : function (req, file , cb){
        // image.jpg
        const fileName = file.originalname.split('.')[0];
        var ext = file.originalname.substr(file.originalname.split('.')[1]);

        // cb(null, file.fieldname + '-' + Date.now() + ext)
        cb(null, `${fileName}-${Date.now()}.${ext}`);
    }
})

module.exports = store = multer({ storage : storage })