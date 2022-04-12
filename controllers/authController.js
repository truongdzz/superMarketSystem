const UsersDB = require('../models/userModel');
const StaffDB = require('../models/staffModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLoginStaff = async (req, res)=> {
    const {username, password} = req.body;
    //check not null
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        //look up the database
        const staffData = await StaffDB.pullData();
        const foundStaff = staffData.find(staff => staff.username === username);

        if(!foundStaff){
            return res.status(401).json({message: `Username ${username} does not exist.`});
        }

        //compare password
        const match = await bcrypt.compare(password, foundStaff.password);
        if(!match){
            res.status(401).json({ message: 'Wrong password!' });
        } else{
            // create jwt
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        username: foundStaff.username,
                        userRole: foundStaff.role,
                        staffid: foundStaff.id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'}
            );
            const refreshToken = jwt.sign(
                {
                    userInfo:{
                        username: foundStaff.username
                    }
                },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '1d'}
            );
            //save the current user with refresh token
            StaffDB.saveRefreshToken(foundStaff, refreshToken, (err, message)=>{
                if(err) console.log(err);
            })

            //send token to client
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAges: 24*60*60*1000});
            //res.json({accessToken});
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAges: 15*60*1000});
            res.json({message: 'login success'});
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const handleLoginUser = async (req, res)=>{
    //get username and password
    const {username, password} = req.body;
    if(!username || !password){
        return res.status(400).json({ message: 'Username and password are required.' });
    }
    try {
        //lookup the databbase
        const userData = await UsersDB.pullData();
        const foundUser = userData.find(person => person.username === username);
        if(!foundUser) return res.status(401).json({message: `Username ${username} does not exist.`});
        //validate password
        const match = await bcrypt.compare(password, foundUser.password);
        if(!match){
            return res.status(401).json({ message: 'Wrong password!' });
        } else{
            //create jwt
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        username: foundUser.username,
                        userRole: foundUser.role,
                        userid:foundUser.id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '15m'}
            );
            const refreshToken = jwt.sign(
                {
                    userInfo:{
                        username: foundUser.username
                    }
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d'}
            );
            // save the refreshtoken to db
            UsersDB.saveRefreshToken(foundUser, refreshToken, (err, message)=>{
                if(err) console.log(err);
            })

            // send token to client
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAges: 24*60*60*1000});
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAges: 15*60*1000});
            // res.json({message: 'login success'});
            res.redirect('/');
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loadUserLoginPage = (req, res)=>{
    res.render('userLogin.ejs');
}

const loadStaffLoginPage = (req, res)=>{
    res.render('staffLogin.ejs');
}

module.exports = {
    handleLoginStaff,
    handleLoginUser,
    loadStaffLoginPage,
    loadUserLoginPage
}