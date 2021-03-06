const db = require('./configDB');

//User object constructor
let User = function (user) {
    this.username = user.username;
    this.phone = user.phone;
    this.password = user.password;
    this.role = user.role;
}

User.createUser = function (newUser) {
    const promise = new Promise((resolve, reject) => {
        const sql = `INSERT INTO user (name, username, phone, password, role, point) VALUES (?, ?, ?, ?, ?, 0)`;
        db.query(sql, Object.values(newUser), (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        })
    })
    return promise;
}

User.getUserByPhone = (phone) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM user WHERE phone = ?";
        db.query(sql, phone, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

User.pullData = () => {
    const promise = new Promise((resolve, reject) => {
        db.query("SELECT * FROM user", (err, data, fields) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

User.saveRefreshToken = (user, token, result) => {
    const sql = "UPDATE user SET refreshToken = ? WHERE username = ?";
    db.query(sql, [token, user.username], (err, data) => {
        if (err) result(err, { message: 'error' });
        else result(null, { message: 'success' });
    })
}

User.clearRefreshToken = (user, result) => {
    const sql = "UPDATE user SET refreshToken = '' WHERE username = ?";
    db.query(sql, user.username, (err, data) => {
        if (err) result(err, { message: 'error' });
        else result(null, { message: 'success' });
    })
}

User.getUserByTime = (hour) => {
    const promise = new Promise((resolve, reject) => {
        const moment = new Date().getTime() - hour * 60 * 60 * 1000;
        const sql = "SELECT * FROM user WHERE UNIX_TIMESTAMP(dateCreated)*1000 >= ?";
        db.query(sql, moment, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

User.getUserIdByUsername = function (userName){
    const promise = new Promise((res,rej)=>{
        const sql=`SELECT u.id
                   FROM user u
                   WHERE u.username = ?        
        `
        db.query(sql,userName,(err,data)=>{
            if(err) rej(err)
            else res(data);
        })
    })
    return promise;
}

User.getUserNameById = function(userid){
    return new Promise((res,rej)=>{
        const sql=`
        SELECT u.name
        FROM user u 
        WHERE u.id = ?
        `;
        db.query(sql,userid,(err,data)=>{
            if(err) rej(err)
            else res(data)
        })
    })
}


User.getUserById = (id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM user WHERE id = ?';
        db.query(sql, id, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

User.sendNoti = (userid, content)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'INSERT INTO `usernoti` (`userid`, `content`) VALUES (?, ?)';
        db.query(sql, [userid, content], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;   
}

User.getNoti = (userid) =>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM `usernoti` WHERE `userid` = ?';
        db.query(sql, [userid], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;      
}

module.exports = User;
