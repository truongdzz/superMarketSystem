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
        const sql = "INSERT INTO `order` (userid, type, staffid, status) VALUES (?, ?, ?, ?)";
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


// get online oder
Order.getOnlineOrderByUserId= function(UserId){
    const promise= new Promise((res,rej)=>{
        const sqltemp= "SELECT goods.name,goods.description,goods.discount,goods.sellPrice,goods.good_img,goodsinorder.amount FROM `order` WHERE userid = ?";
        const sql="SELECT gs.name,gs.sellPrice,gs.discount,gi.amount,gs.description,gs.good_img FROM `order` o JOIN goodsinorder gi ON o.id = gi.orderID JOIN goods gs ON gi.goodID = gs.id WHERE o.type = 'online' AND o.status = 'inprogress' AND o.userid = ? "
        db.query(sql,UserId,(err,data)=>{
            if(err) rej(err);
            else res(data);
        })
    })
    return promise
}

module.exports = Order;