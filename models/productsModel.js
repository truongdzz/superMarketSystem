const db = require('./configDB');

//construc product Object
let Product = function(product){
    this.name = product.name;
    this.description = product.description;
    this.buyPrice = product.buyPrice;
    this.sellPrice = product.sellPrice;
    this.discount = product.discount;
    this.amount = product.amount;
    this.category =  product.category;
    this.position = product.position;
}

Product.getProductById = (id) => {
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM goods WHERE id = ?";
        db.query(sql, id, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Product.getAllProduct = ()=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM goods";
        db.query(sql, (err,data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Product.upadteAmount = (product, result)=>{
    const sql = "UPDATE goods SET amount = amount - ? WHERE id = ? ";
    db.query(sql, [product.amount, product.id], (err, data)=>{
        if(err) result(err, null); 
        else result(null, data);
    })
}

Product.updateproduct = (productid, tensp, amount, position, price) => {
    const sql = "UPDATE goods SET name = ? , amount = ? , position = ? , sellPrice = ? WHERE id = ? ";
    db.query(sql, [tensp, amount, position, price, productid], (err, data) => {})
}

Product.addproduct = (img, name, amount, position, price) => {
    const sql = "INSERT INTO `goods` (`name`, `sellPrice`, `amount`,  `position`, `good_img`) VALUES (? , ? , ? , ?, ?); ";
    db.query(sql, [name, price, amount, position, img], (err, data) => {})
}

Product.importproduct = (imid, imamount, staff_id) => {
    const sql = "INSERT INTO `importOrder` (`good`, `amount`, `time`, `staff`) VALUES (? , ? , current_timestamp(), ? );";
    db.query(sql, [imid, imamount, staff_id], (err, data) => {})
}

Product.deleteproduct = (pid) => {
    const sql = "DELETE FROM goods WHERE id = ?  ";
    db.query(sql, [pid], (err, data) => {})
}

Product.getProductByCateGory = (cat) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM goods WHERE category = ?";
        db.query(sql, cat, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Product.updateproduct = (productid, tensp, amount, position, price) => {
    const sql = "UPDATE goods SET name = ? , amount = ? , position = ? , sellPrice = ? WHERE id = ? ";
    db.query(sql, [tensp, amount, position, price, productid], (err, data) => {})
}

Product.addproduct = (img, name, amount, position, price) => {
    const sql = "INSERT INTO `goods` (`name`, `sellPrice`, `amount`,  `position`, `good_img`) VALUES (? , ? , ? , ?, ?); ";
    db.query(sql, [name, price, amount, position, img], (err, data) => {})
}

Product.importproduct = (imid, imamount, imamount1, staff_id) => {
    const sql = "INSERT INTO `importOrder` (`good`, `amount`, `time`, `staff`) VALUES (? , ? , current_timestamp(), ? );";
    db.query(sql, [imid, imamount, staff_id], (err, data) => {})
    const sql1 = "UPDATE goods SET amount = ? WHERE id = ? ";
    db.query(sql1, [imamount1, imid], (err, data) => {})
}

Product.deleteproduct = (pid) => {
    const sql = "DELETE FROM goods WHERE id = ?  ";
    db.query(sql, [pid], (err, data) => {})
}

Product.updatePrice = (id, price)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'UPDATE goods SET `sellPrice` = ? WHERE `id` = ?';
        db.query(sql, [price, id], (err, data)=>{
            if (err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Product.updateDiscount = (id, value)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'UPDATE goods SET `discount` = ? WHERE `id` = ?';
        db.query(sql, [value, id], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Product.updateBuyPrice = (id, value)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = 'UPDATE goods SET buyPrice = ? WHERE `id` = ?';
        db.query(sql, [value, id], (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

module.exports = Product;