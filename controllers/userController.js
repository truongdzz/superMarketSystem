const Goods=require('../models/goodsModel');
const Category=require('../models/categoryModel');
const CartProduct=require('../models/orderModel');
const req = require('express/lib/request');



const buying=async (req,res)=>{
    try {
        let login=false;
        let productInCart;
        if(req.username){
            login=true;
            // console.log(req.userId)
            // console.log(res.userId in res);
            productInCart=await CartProduct.getOnlineOrderByUserId(req.userId);
            if(productInCart.length<=0){
                productInCart=false;
            }
        }
        else{
            login=false;
            productInCart=false;
        }
        // console.log(req.username);
        // console.log(login);
        // console.log(productInCart.length);
        console.log(productInCart);
        const goodList=await Goods.getALLgoods();
        const categorylist=await Category.getAllCategory();
        res.render('customerView/index.ejs',{
            data:goodList,
            categories:categorylist,
            isLogin:login,
            productInCart:productInCart,
        });
    } catch (error) {
        console.log(error)
    }

}


const buyCategory=async (req,res)=>{
    try {

        let login=false;
        if(req.username){
            login=true;
        }
        else{
            login=false;
        }

        const cate_id=getIDfrompath(req.path);
        const goodList=await Goods.getGoodsForCategory(cate_id);
        const categorylist=await Category.getAllCategory();
        res.render('customerView/buyForCategory.ejs',{
            data:goodList,
            categories:categorylist,
            isLogin:login,
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