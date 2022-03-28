const usersDB = require('../models/userModel');
const staffDB = require('../models/staffModel');

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleUserRefreshToken = async (req, res) => {
    //get cookies
    const cookies = req.cookies;

    //if there is no cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    //get token from client
    const refreshToken = cookies.jwt;

    try {
        //find user have the same refersh token in db
        const usersData = await usersDB.pullData();
        const foundUser = usersData.find(person => person.refreshToken === refreshToken);

        if (!foundUser) return res.status(403).json({ message: 'Forbidden' });

        //evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || decoded.userInfo.username !== foundUser.username) {
                    return res.status(403).json({ message: 'Forbidden' });
                }

                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            username: foundUser.username,
                            userRole: foundUser.role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );

                res.cookie('accessToken', accessToken, { httpOnly: true, maxAges: 15*60*1000});
                res.redirect('/');
            }
        )
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const handleStaffRefreshToken = async (req, res) => {
    //get cookies
    const cookies = req.cookies;

    //if there is no cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' });

    //get token from client
    const refreshToken = cookies.jwt;

    try {
        //find user have the same refersh token in db
        const staffData = await staffDB.pullData();
        const foundStaff = staffData.find(person => person.refreshToken === refreshToken);

        if (!foundStaff) return res.status(403).json({ message: 'Forbidden' });

        //evaluate jwt
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || decoded.userInfo.username !== foundStaff.username) {
                    return res.status(403).json({ message: 'Forbidden' });
                }

                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            username: foundStaff.username,
                            userRole: foundStaff.role,
                            staffid: foundStaff.id
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '15m' }
                );
                
                res.cookie('accessToken', accessToken, {httpOnly:true, maxAges: 15*60*1000});
                res.redirect('/admin');
            }
        )
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


module.exports = {
    handleStaffRefreshToken,
    handleUserRefreshToken
};