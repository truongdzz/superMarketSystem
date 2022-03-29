const Goods=require('../models/goodsModel');
const Category=require('../models/categoryModel');

const buying=async (req,res)=>{
    try {
        const goodList=await Goods.getALLgoods();
        const categorylist=await Category.getAllCategory();
        res.render('customerView/index.ejs',{
            data:goodList,
            categories:categorylist
        });
    } catch (error) {
        console.log(error)
    }

}


const buyCategory=async (req,res)=>{
    try {
        const cate_id=getIDfrompath(req.path);
        const goodList=await Goods.getGoodsForCategory(cate_id);
        const categorylist=await Category.getAllCategory();
        res.render('customerView/buyForCategory.ejs',{
            data:goodList,
            categories:categorylist,
            // pathNow:'/'+req.path
        })
    } catch (error) {
        console.log(error);
    }

    // console.log(req.path);
    // console.log(getIDfrompath(req.path))
    // res.send(""+req.path)
}

function getIDfrompath(path){
    path=''+path;
    return path.slice(10)
}

module.exports={
    buying,
    buyCategory,
}