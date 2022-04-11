const { DATETIME } = require('mysql/lib/protocol/constants/types');
const db = require('./configDB');

//construc order object
let Order = function (order) {
    this.userid = order.userid;
    this.type = order.type;
    this.staffid = order.staffid;
    this.products = {};
}

Order.pullDataByTime = (passHour) => {
    const promise = new Promise((resolve, reject) => {
        const currentTime = new Date().getTime();
        const passTime = new Date(currentTime - passHour * 60 * 60 * 1000);

        const sql = "SELECT * FROM `order` WHERE UNIX_TIMESTAMP(date)*1000 >= ?";
        //const sql = "SELECT UNIX_TIMESTAMP('2022-03-24 13:13:00')";
        db.query(sql, passTime.getTime(), (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

Order.createNewOrder = (order) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "INSERT INTO `order` (userid, type, staffid, status, price) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, Object.values(order), (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Order.getOnlineOrdersByTime = (hour) => {
    const promise = new Promise((resolve, reject) => {
        const now = new Date().getTime() - hour * 60 * 60 * 1000;;
        const sql = "SELECT * FROM `order` WHERE type = 'online' AND UNIX_TIMESTAMP(date)*1000 >= ?";
        db.query(sql, now, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Order.getOfflineOrdersByTime = (hour) => {
    const promise = new Promise((resolve, reject) => {
        const now = new Date().getTime() - hour * 60 * 60 * 1000;
        const sql = "SELECT * FROM `order` WHERE type = 'offline' AND UNIX_TIMESTAMP(`date`)*1000 >= ?";
        db.query(sql, now, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Order.getAllOrdersByTime = (from, to) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `order` WHERE UNIX_TIMESTAMP(date)*1000 >= ? AND UNIX_TIMESTAMP(date)*1000 <= ?";
        db.query(sql, [from, to], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Order.getOrderById = (id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM `order` WHERE id = ?';
        db.query(sql, id, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Order.getOrdersByUserId = (userId)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM `order` WHERE userid = ?';
        db.query(sql, userId, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}
module.exports = Order;