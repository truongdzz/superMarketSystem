const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyUserJWT = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.accessToken) {
        next();
    } else {
        const token = cookies.accessToken;
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).render('others/outOfTime.ejs');
            }
            req.username = decoded.userInfo.username;
            req.userRole = decoded.userInfo.userRole;
            req.staffid = decoded.userInfo.staffid;
            next();
        })
    }
}
module.exports = verifyUserJWT;