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

module.exports = Product;