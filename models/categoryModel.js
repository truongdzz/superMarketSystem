const db = require('./configDB');

let Category = function(category){
    this.name = category.name;
}

Category.getCategoryById = (id)=>{
    const promise = new Promise((resolve, reject)=>{
        const sql = "SELECT * FROM category WHERE id = ?";
        db.query(sql, id, (err, data)=>{
            if(err) reject(err);
            else resolve(data);
        })
    })
    return promise;
}

Category.getAllCategory=function(){
    const promise= new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM category";
        db.query(sql,(err,data)=>{
            if (err) reject(err)
            else resolve(data)
        })
    })
    return promise;
}


module.exports = Category;