const db = require('./configDB');

let ImportOrder = function (order) {
    this.good = order.good;
    this.amount = order.amount;
}

ImportOrder.getOrdersByTime = (from, to) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM importOrder WHERE UNIX_TIMESTAMP(`time`)*1000 >= ? AND UNIX_TIMESTAMP(`time`)*1000 <= ? ";
        db.query(sql, [from, to], (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}


module.exports = ImportOrder;