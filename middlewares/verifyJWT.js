const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    
    const cookies = req.cookies;
    if(!cookies?.accessToken) res.status(401).render('others/401.ejs');

    const token = cookies.accessToken;

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded)=>{
            if (err) {
                return res.status(403).render('others/refreshStaff.ejs');
            }
            req.username = decoded.userInfo.username;
            req.userRole = decoded.userInfo.userRole;
            req.staffid = decoded.userInfo.staffid;
            next();
        }
    )
}

module.exports = verifyJWT;