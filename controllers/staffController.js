const StaffInfo= require('../models/staffModel');
const bcrypt = require('bcrypt');

const loadEditProfile = async (req, res)=>{
    const id = req.staffid;
    console.log(id);
    try{
        const staff = await StaffInfo.getStaffById(id);
        const data = {
            staff: staff[0]
        }
        console.log(data);
        res.render('others/editProfile.ejs', data);
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: 'Server Error'
        })
    }
}

const updateProfile = async (req, res)=>{
    const {name, phone} = req.body;
    const id = req.staffid;
    try{
        console.log("alo")
        const checkStaff = await StaffInfo.getStaffByPhone(phone);
        if(checkStaff.length > 1){
            return res.status(409).json({
                message: 'Phone number has already used.'
            })
        } 
        else if(checkStaff.length == 1){
            if(checkStaff[0].id != id){
                return res.status(409).json({
                    message: 'Phone number has already used.'
                })      
            }
        }
        

        const result = await StaffInfo.setNameAndPhone(name, phone, id);
        res.status(200).json({
            message: 'Update success'
        });
    }catch(error){
        console.log(error.message);
        res.status(500).send("Server Error, try it later");
    }
}

const updatePassword = async (req, res)=>{
    const {password} = req.body;
    const id = req.staffid;
    try{
        const hashedPwd = await bcrypt.hash(password, 10);
        StaffInfo.setPassword(hashedPwd, id);
        return res.status(200).json({
            message: "Update success",
            logout: true
        })
    }catch(error){
        console.log(error.message);
        return res.status(500).json({
            message: "Server error. Try it later."
        })
    }

}

module.exports = {
    loadEditProfile,
    updateProfile,
    updatePassword
}