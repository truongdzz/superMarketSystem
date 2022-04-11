const UsersDB = require('../models/userModel');
const StaffDB = require('../models/staffModel');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLoginStaff = async (req, res)=> {
    const {username, password} = req.body;
    //check not null
    if (!username || !password) {
        return res.status(400).render('staffLogin', {
            message: "Username and password are requireed"
        })
    }

    try {
        //look up the database
        const staffData = await StaffDB.pullData();
        const foundStaff = staffData.find(staff => staff.username === username);

        if(!foundStaff){
            //return res.status(401).json({message: `Username ${username} does not exist.`});
            return res.status(401).render('staffLogin',{
                message: `Username ${username} does not exist.`
            })
        }

        //compare password
        const match = await bcrypt.compare(password, foundStaff.password);
        if(!match){
            //res.status(401).json({ message: 'Wrong password!' });
            res.status(401).render('staffLogin',{
                message: 'Wrong password.'
            })
        } else{
            // create jwt
            // const accessToken = jwt.sign(
            //     {
            //         userInfo: {
            //             username: foundStaff.username,
            //             userRole: foundStaff.role,
            //             staffid: foundStaff.id
            //         }
            //     },
            //     process.env.ACCESS_TOKEN_SECRET,
            //     {expiresIn: '15m'}
            // );
            const refreshToken = jwt.sign(
                {
                    userInfo:{
                        username: foundStaff.username,
                        userRole: foundStaff.role,
                        staffid: foundStaff.id
                    }
                },
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn: '15m'}
            );
            //save the current user with refresh token
            StaffDB.saveRefreshToken(foundStaff, refreshToken, (err, message)=>{
                if(err) console.log(err);
            })

            //send token to client
            res.cookie('jwt', refreshToken, { httpOnly: true});
            
            // res.cookie('accessToken', accessToken, { httpOnly: true, maxAges: 15*60*1000});
            
            
            if (foundStaff.role === "cashier") {
                res.redirect('/cashier');
            } else if(foundStaff.role === "admin"){
                res.redirect("/admin");
            } else res.redirect('/ware');
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const handleLoginUser = async (req, res)=>{
    //get username and password
    const {username, password} = req.body;
    if(!username || !password){
        //return res.status(400).json({ message: 'Username and password are required.' });
        return res.status(400).render('userLogin', {
            message: "Username and password are required."
        })
    }
    try {
        //lookup the databbase
        const userData = await UsersDB.pullData();
        const foundUser = userData.find(person => {
            if(person.username === username || person.phone === username) return true;
            else return false;
        });
        if(!foundUser) 
            //return res.status(401).json({message: `Username ${username} does not exist.`});
            return res.status(401).render('userLogin', {
                message: `Username or phone number does not exist.`
            })
        //validate password
        const match = await bcrypt.compare(password, foundUser.password);
        if(!match){
            //return res.status(401).json({ message: 'Wrong password!' });
            return res.status(401).render('userLogin', {
                message: 'Wrong password.'
            })
        } else{
            //create jwt
            // const accessToken = jwt.sign(
            //     {
            //         userInfo: {
            //             username: foundUser.username,
            //             userRole: foundUser.role
            //         }
            //     },
            //     process.env.ACCESS_TOKEN_SECRET,
            //     {expiresIn: '15m'}
            // );
            const refreshToken = jwt.sign(
                {
                    userInfo:{
                        username: foundUser.username,
                        userRole: foundUser.role,
                        userid: foundUser.id
                    }
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '15m'}
            );
            // save the refreshtoken to db
            UsersDB.saveRefreshToken(foundUser, refreshToken, (err, message)=>{
                if(err) console.log(err);
            })

            // send token to client
            res.cookie('jwt', refreshToken, { httpOnly: true});
            // res.cookie('accessToken', accessToken, { httpOnly: true, maxAges: 15*60*1000});
            res.redirect('/');
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loadUserLoginPage = (req, res)=>{
    res.render('userLogin.ejs',{
        message: ""
    });
}

const loadStaffLoginPage = (req, res)=>{
    res.render('staffLogin.ejs', {
        message: ""
    });
}

module.exports = {
    handleLoginStaff,
    handleLoginUser,
    loadStaffLoginPage,
    loadUserLoginPage
}