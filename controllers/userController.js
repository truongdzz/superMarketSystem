const Goods=require('../models/goodsModel');

const buying=async (req,res)=>{
    try {
        const goodList=await Goods.getALLgoods();
        res.render('customerView/index.ejs',{
            data:goodList
        });
    } catch (error) {
        
    }

}

module.exports={
    buying,
}