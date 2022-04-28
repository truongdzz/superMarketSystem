const db = require('./configDB');

let Schedule = function(schedule){
    this.id = schedule.id;
    this.day = schedule.day;
    this.time = schedule.time;
}

Schedule.getShiftnumber = (day, time)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT `number` FROM `shift` WHERE `day` = ? AND `time` = ?';
        db.query(sql, [day, time], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Schedule.register = (id, number)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'INSERT INTO `schedule` VALUES (?, ?, ?)';
        db.query(sql, [id, Number(number), 'Waiting'], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Schedule.getAllSchedule = (id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT `shift`.`day`, `shift`.`time`, `schedule`.`status`, `schedule`.`staff`, `schedule`.`shift` FROM `shift` INNER JOIN `schedule` ON `shift`.`number` = `schedule`.`shift` WHERE `schedule`.`staff` = ?';
        db.query(sql, id, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Schedule.getSchedule = (id, shift)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM `schedule` WHERE `staff` = ? AND `shift` = ?";
        db.query(sql, [id, shift], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Schedule.deleteSchedule = (id, shift)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "DELETE FROM `schedule` WHERE `staff` = ? AND `shift` = ?";
        db.query(sql, [id, shift], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;   
}

Schedule.setStatus = (id, shift, status)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "UPDATE `schedule` SET `status` = ? WHERE `staff` = ? AND `shift` = ?";
        db.query(sql, [status, id, shift], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;      
}

Schedule.getScheduleAll = ()=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM `schedule`";
        db.query(sql, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;         
}

Schedule.addSchedule = (id, number, status)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'INSERT INTO `schedule` VALUES (?, ?, ?)';
        db.query(sql, [id, Number(number), status], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

module.exports = Schedule;