const StaffInfo= require('../models/staffModel');
const Schedule = require('../models/scheduleModel');
const Shift = require('../models/shiftModel');

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
    const {staffid} = req;
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

        //get staff info
        const staffinfo = await StaffInfo.getStaffById(staffid);
        const dayy = day == "mon" ? "Monday"
            : day == "tue" ? "Tuesday"
                : day == "wed" ? "WednesDay"
                    : day == "thu" ? "Thursday"
                        : day == "fri" ? "Friday" 
                            :day == "sat" ? "Saturday"
                                : "Sunday"
        const timee = (time == "sang") ? "Morning" 
            : time == "chieu" ? "Afternoon" : "Night"
        const content = `Staff ${staffinfo[0].name} want to work on ${dayy} ${timee}`

        // send noti to admin
        await StaffInfo.sendNoti(0, 33, "Shift registration", "", content);
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
    const {staffid} = req;
    try{
        //check if exist schedule
        const foundSchedule = await Schedule.getSchedule(id, shift);
        if(foundSchedule.length == 0){
            return res.status(400).json({
                message: `Schedule does not exist`
            })
        } else {
            const staffinfo = await StaffInfo.getStaffById(staffid);
            const schedule = foundSchedule[0];

            const shiftinfo = await Shift.getShiftByNumber(shift);
            day = shiftinfo[0].day;
            time = shiftinfo[0].time;
            const dayy = day == "mon" ? "Monday"
                : day == "tue" ? "Tuesday"
                    : day == "wed" ? "WednesDay"
                        : day == "thu" ? "Thursday"
                            : day == "fri" ? "Friday" 
                                :day == "sat" ? "Saturday"
                                    : "Sunday"
            const timee = (time == "sang") ? "Morning" 
                : time == "chieu" ? "Afternoon" : "Night" 

            if(schedule.status == "Accepted"){
                //turn to pending
                await Schedule.setStatus(id, shift, "Onleave");


                       
                const content = `Staff ${staffinfo[0].name} want to leave the shift on ${dayy} ${timee}.`;
                await StaffInfo.sendNoti(0, 33, "Schedule leaving", content, content)

                return res.status(200).json({
                    message: "Your request of leaving this shift has been send",
                    reload: true
                })
            }
            if(schedule.status == "Pending"){
                //turn to pending
                await Schedule.deleteSchedule(id, shift);

                const content = `Staff ${staffinfo[0].name} refuse to join the shift on ${dayy} ${timee}.`;
                await StaffInfo.sendNoti(0, 33, "Schedule Refusion", content, content)

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
        const staffinfo = await StaffInfo.getStaffById(staffid);
        await Schedule.setStatus(staffid, shift, "Accepted");

        const shiftinfo = await Shift.getShiftByNumber(shift);
            day = shiftinfo[0].day;
            time = shiftinfo[0].time;
            const dayy = day == "mon" ? "Monday"
                : day == "tue" ? "Tuesday"
                    : day == "wed" ? "WednesDay"
                        : day == "thu" ? "Thursday"
                            : day == "fri" ? "Friday" 
                                :day == "sat" ? "Saturday"
                                    : "Sunday"
            const timee = (time == "sang") ? "Morning" 
                : time == "chieu" ? "Afternoon" : "Night" 


        const content = `Staff ${staffinfo[0].name} accepted to join the shift on ${dayy} ${timee}`
        await StaffInfo.sendNoti(0, 33, "Schdule Accepted", content, content)

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

const getNoti = async(req, res) => {
    const { notiid } = req.params;
    const id = req.staffid;
    try {
        const staff = await StaffInfo.getStaffById(id);
        let Data = function() {
            this.noti = null;
            
        };
        data = new Data;
        const noti = await StaffInfo.getnoti(notiid);
        data.noti = noti[0];

        // res.send(JSON.stringify(data))
        res.render('managerView/getnoti.ejs', { data: data, staff: staff[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    loadEditProfile,
    updateProfile,
    updatePassword,
    registSchedule,
    deleteSchedule,
    acceptSchedule,
    getNoti
}