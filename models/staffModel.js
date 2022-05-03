const db = require('./configDB');

//Staff object constructor
let Staff = function(staff){
    this.username = staff.username;
    this.password = staff.password;
    this.role = staff.role;
};         

Staff.getStaffByUsername = (username)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM staff WHERE username = ?";
        db.query(sql, username, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Staff.getStaffById = (id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM staff WHERE `id` = ?";
        db.query(sql, [id], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Staff.createStaff = (newStaff, result)=>{
    const sql = "INSERT INTO staff (name, phone, username, password, role) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, Object.values(newStaff), (err, data)=>{
        if(err){
            result(err, null);
        } else{
            result(null, data);
        }
    })
}

Staff.pullData = ()=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM staff";
        db.query(sql, (err, data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

Staff.saveRefreshToken = (staff, token, result)=>{
    const sql = "UPDATE staff SET refreshToken = ? WHERE username = ?";
    db.query(sql, [token, staff.username], (err, data)=>{
        if(err) result(err, {message: 'error'});
        else result(null, {message: 'success'});
    })
}

Staff.clearRefreshToken = (staff, result) => {
    const sql = "UPDATE staff SET refreshToken = '' WHERE username = ?";
    db.query(sql, staff.username, (err, data)=>{
        if(err) result(err, {message: 'error'});
        else result(null, {message: 'success'});
    })
}

Staff.recentStaff = () => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM staff ORDER BY id DESC LIMIT 10";
        db.query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

Staff.setNameAndPhone = (name, phone, id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "UPDATE `staff` SET `name` = ? , `phone` = ? WHERE `id` = ?";
        db.query(sql, [name, phone, id], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Staff.getStaffByPhone = (phone) => {
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM staff  WHERE `phone` = ?";
        db.query(sql, [phone], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;   
}

Staff.setPassword = (password, id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "UPDATE `staff` SET `password` = ? WHERE `id` = ?";
        db.query(sql, [password, id], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Staff.pullnoti = (staffid) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM notification WHERE `notification`.`receiver` = 0 OR `notification`.`receiver` = ? ORDER BY id DESC LIMIT 10 ;";
        db.query(sql, staffid, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

Staff.getnoti = (notiid) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM notification WHERE id = ?";
        db.query(sql, [notiid], (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

Staff.pullStaffID = (staffID) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM staff WHERE id = ?";
        db.query(sql, staffID, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

Staff.updateStaff = (staffid, name, phone, type, salarybase) => {
    console.log(staffid, name, phone, type, salarybase);
    const sql = "UPDATE staff SET name = ?, phone = ?, role = ?, salaryBase = ? WHERE id = ?";
    db.query(sql, [name, phone, type, salarybase, staffid], (err, data) => {})
}

Staff.deleteStaff = (staffid) => {
    const sql = "DELETE FROM staff WHERE id = ?";
    db.query(sql, staffid, (err, data) => {})
}


Staff.searchStaff = (search) => {

    const promise = new Promise((resolve, reject) => {
        var str = "%".concat(search, "%")
        const sql = "SELECT * FROM `staff` WHERE name LIKE ? OR id LIKE ?"
        db.query(sql, [str, str], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;

}

Staff.sendNoti = (sender, staffid, title, subtitle, content) => {
        const promise = new Promise((resolve, reject) => {
            const sql = "INSERT INTO `notification` (`sender`, `receiver`, `title`, `subtitle`, `content`, `time`) VALUES (? ,?, ? , ? , ? , current_timestamp());"
            db.query(sql, [sender, staffid, title, subtitle, content], (err, data) => {
                if (err) reject(err);
                else resolve(data);
            })
        })
        return promise;

    }

module.exports = Staff;