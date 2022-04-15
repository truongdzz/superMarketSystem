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
        const sql=`SELECT gs.name,gs.sellPrice,gs.discount,gi.amount,gs.description,gs.good_img, gi.goodID,gi.orderID,c.name AS category 
                    FROM \`order\` o 
                    JOIN goodsinorder gi ON o.id = gi.orderID 
                    JOIN goods gs ON gi.goodID = gs.id 
                    JOIN category c ON c.id = gs.category  
                    WHERE o.type = 'online' AND o.status = 'pending' AND o.userid = ? `;
        db.query(sql,UserId,(err,data)=>{
            if(err) rej(err);
            else res(data);
        })
    })
    return promise
}

// delete product from cart
Order.deleteProductOutCart=function(productDelId,orderIDs){
    const promise=new Promise((res,rej)=>{
        const sql="DELETE FROM goodsinorder WHERE goodID =? AND orderID =?";
        db.query(sql,[productDelId,orderIDs],(err,data)=>{
            if (err)rej(err)
            else res(data);
        })
    })
    return promise;
}

// get number of pending cart

Order.getNumPendingCart=function(userName){
    const promise=new Promise((res,rej)=>{
        const sql=`SELECT COUNT(*) as num
                   FROM user U
                   JOIN \`order\` O ON U.id = O.userid
                   WHERE U.username = ? AND O.status='pending'
        
        `
        db.query(sql,userName,(err,data)=>{
            if(err)rej(err)
            else res(data);
        })
    })
    return promise;
}

Order.getIdPendingCart=function(userName){
    const promise=new Promise((res,rej)=>{
        const sql=`SELECT O.id
                   FROM user U
                   JOIN \`order\` O ON U.id = O.userid
                   WHERE U.username = ? AND O.status='pending'
                   LIMIT 1        
        `;
        db.query(sql,userName,(err,data)=>{
            if(err)rej(err)
            else res(data);
        })
    })
    return promise;
}

Order.productExistInCart=function(orderId,goodId){
    const promise=new Promise((res,rej)=>{
        const sql=`SELECT COUNT(*) as num
                   FROM goodsinorder gi        
                   WHERE gi.goodID=? AND gi.orderID = ?
                   LIMIT 1        
        `;
        db.query(sql,[goodId,orderId],(err,data)=>{
            if(err)rej(err)
            else res(data);
        })
    })
    return promise;
}

Order.insertProductToCart=function(orderId,goodId,num){
    if(num==undefined){
        num=1;
    }
    const promise = new Promise((res,rej)=>{
        const sql=`
        INSERT INTO goodsinorder (orderID,goodID,amount)
        VALUES (?,?,?)
        `
        db.query(sql,[orderId,goodId,num],(err,data)=>{
            if(err)rej(err)
            else res(data);
        })
    })
    return promise;
}

Order.createPendingOrder=function(userId){
    const promise=new Promise((res,rej)=>{
        const sql=`
        INSERT INTO \`order\` (id, userid, date, type, price, status, staffid) 
        VALUES (NULL,?, current_timestamp(), 'online', NULL, 'pending', NULL);
        `;
        db.query(sql,userId,(err,data)=>{
            if(err)rej(err)
            else res(data);
        })
    })
    return promise;
}
module.exports = Order;