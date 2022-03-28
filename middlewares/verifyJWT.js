const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    // const authHeader = req.headers.authorization || req.headers.Authorization;
    // if (!authHeader?.startsWith('Bearer ')) {
    //     //res.status(401).json({message: 'Unauthorized'});
    //     return res.status(401).render('others/401.ejs');
    // }
    // const token = authHeader.split(' ')[1];
    
    const cookies = req.cookies;
    if(!cookies?.accessToken) res.status(401).render('others/401.ejs');

    const token = cookies.accessToken;

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if (err) {
                return res.status(403).render('others/outOfTime.ejs');
            }
            req.username = decoded.userInfo.username;
            req.userRole = decoded.userInfo.userRole;
            req.staffid = decoded.userInfo.staffid;
            next();
        }
    )
}

module.exports = verifyJWT;