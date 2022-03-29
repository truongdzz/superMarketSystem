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

Staff.createStaff = (newStaff, result)=>{
    const sql = "INSERT INTO staff (name,username, password, role) VALUES (?, ?, ?, ?)";
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

module.exports = Staff;