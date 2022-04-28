const StaffInfo= require('../models/staffModel');
const Schedule = require('../models/scheduleModel');
const bcrypt = require('bcrypt');

const loadEditProfile = async (req, res)=>{
    const id = req.staffid;
    
    try{
        const staff = await StaffInfo.getStaffById(id);
        const scheduleInfo = await Schedule.getAllSchedule(id);
        const data = {
            staff: staff[0],
            schedule: scheduleInfo
        }
        
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

const registSchedule = async (req, res)=>{
    const {id, day, time} = req.body;
    try{
        const number = await Schedule.getShiftnumber(day, time);

        //check duplicate schedule
        const foundSchedule = await Schedule.getSchedule(id, number[0].number);
        if(foundSchedule.length > 0){
            return res.status(409).json({
                message: 'You have already had this schedule on your list.'
            })
        }

        const regist = await Schedule.register(id, number[0].number);
        res.status(200).json({
            message: 'Registration successful.',
            reload: true
        })
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: 'Server Error. Try it later.'
        })
    }
}

const deleteSchedule = async (req, res)=>{
    const {id, shift} = req.body;
    try{
        //check if exist schedule
        const foundSchedule = await Schedule.getSchedule(id, shift);
        if(foundSchedule.length == 0){
            return res.status(400).json({
                message: `Schedule does not exist`
            })
        } else {
            const schedule = foundSchedule[0];
            if(schedule.status == "Accepted"){
                //turn to pending
                await Schedule.setStatus(id, shift, "Onleave");
                return res.status(200).json({
                    message: "Your request of leaving this shift has been send",
                    reload: true
                })
            }
            if(schedule.status == "Pending"){
                //turn to pending
                await Schedule.deleteSchedule(id, shift);
                return res.status(200).json({
                    message: "Your refuse of joining this shift has been send",
                    reload: true
                })
            }
            if(schedule.status == "Onleave"){
                return res.status(200).json({
                    message: "Your request of leaving this shift has been send. You cant delete this schedule until admin's response.",
                    reload: true
                })
            }
            if(schedule.status == "Waiting"){
                //turn to pending
                await Schedule.deleteSchedule(id, shift);
                return res.status(200).json({
                    message: "Your request of joining this shift has been deleted",
                    reload: true
                })
            }
        }
        res.status(200).json({
            message: 'No Schedule deleted.????!!!!!',
            reload: true
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: 'Server Error. Try it later.'
        })
    }
}

const acceptSchedule = async (req, res)=>{
    //turn status from pending to accept
    try{
        const {staffid, shift} = req.query;
        await Schedule.setStatus(staffid, shift, "Accepted");
        res.status(200).json({
            message: "You are now working on this shift.",
            reload: true
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Server error, try it later."
        })
    }
}

module.exports = {
    loadEditProfile,
    updateProfile,
    updatePassword,
    registSchedule,
    deleteSchedule,
    acceptSchedule
}