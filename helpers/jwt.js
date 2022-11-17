const { expressjwt: expressJwt } = require('express-jwt');


function authJwt() {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        // isRevoked: isRevoked
    }).unless({
        path: [
            {url:/\/public\/uploads(.*)/,methods:['GET','OPTIONS']},
            `${api}/users/signIn`,
            `${api}/users/register`,
        ]
    })
}



// function authJwt(){
//     const secret = process.env.JWT_SECRET
//     const api = process.env.API_URL

//     return expressJwt({
//         secret,
//         algorithms:['HS256'],
//         isRevoked:isRevoked
//     }).unless({
//         path:[
//             {url:/\/public\/uploads(.*)/,methods:['GET','OPTIONS']},
//             `${api}/users/signIn`,
//             `${api}/users/register`,
//         ]
//     })
// }

async function isRevoked(req,token,){
    console.log('req,payload,done',token);
    
    if(token.payload.roleType === 'employee' ){
        return true
    }
    
    // return false

    // done()
}

module.exports = authJwt