const database=require('./configDB');


// Good object construct 
let Good=function(good){
    this.name=good.name;
    this.description=good.description;
    this.buyPrice=good.buyPrice;
    this.sellPrice=good.sellPrice;
    this.discount=good.discount;
    this.category=good.category;
    this.good_img=good.good_img;
}

Good.getALLgoods=function(){
    const promise=new Promise((resolve,reject)=>{
        const sql = "SELECT * FROM goods";
        database.query(sql,(err,data)=>{
            if(err) reject(err);
            else resolve(data)
        })
    })
    return promise;
}

Good.getGoodsForCategory=function(categoryId){
    const promise=new Promise((resolve,reject)=>{
        const sql="SELECT * FROM goods WHERE category = ? ";
        database.query(sql,categoryId,(err,data)=>{
            if(err) reject(err);
            else resolve(data);
        });
    });
    return promise;
}

Good.getSellPriceFromGoodId = function(goodId){
    return new Promise((res,rej)=>{
        const sql = `
        SELECT (sellPrice * (1-discount*0.01)) as sellPrice
        FROM goods gs
        WHERE gs.id = ?        
        `;
        database.query(sql,goodId,(err,data)=>{
            if(err) rej(err);
            else res(data);
        });
    });
}

module.exports=Good