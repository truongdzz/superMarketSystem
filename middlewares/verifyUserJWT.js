const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyUserJWT = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        next();
    } else {
        const token = cookies.jwt;
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.clearCookie('jwt', {httpOnly: true});
                return res.status(403).render('others/refreshUser.ejs');
            }
            req.username = decoded.userInfo.username;
            req.userRole = decoded.userInfo.userRole;
            req.userId = decoded.userInfo.userid;
            next();
        })
    }
}
module.exports = verifyUserJWT;