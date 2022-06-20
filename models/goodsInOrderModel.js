const db = require('./configDB');

//consttruc goodsInOrder object
let GoodsInOrder = function(goodsInOrder){
    this.goodID = goodsInOrder.goodID;
    this.amount = goodsInOrder.amount;
    this.orderID = goodsInOrder.orderID;
    this.price = goodsInOrder.price;
}

GoodsInOrder.createNew = (goodsInOrder, result) => {
    const sql = "INSERT INTO goodsInOrder (goodID, amount, orderID, price) VALUES (?, ?, ?, ?)";
    db.query(sql, Object.values(goodsInOrder), (err, data)=>{
        if(err) result(err, null);
        else result(null, data);
    })
}

GoodsInOrder.getGoodsInOrder = (order) => {
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM goodsInOrder WHERE orderID = ?";
        db.query(sql, order.id, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

GoodsInOrder.getGoodsInOrderById = (order, id) => {
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM goodsInOrder WHERE orderID = ? AND goodID = ?";
        db.query(sql, [order.id, id], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

GoodsInOrder.getGoodsById = (id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM goodsInOrder WHERE goodID = ?';
        db.query(sql, id, (err,data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

module.exports = GoodsInOrder;