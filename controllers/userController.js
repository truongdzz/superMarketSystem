const Goods=require('../models/goodsModel');
const Category=require('../models/categoryModel');
const CartProduct=require('../models/orderModel');
const UserMode=require('../models/userModel');
// const req = require('express/lib/request');



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
        // console.log(productInCart);
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
        let productInCart;
        if(req.username){
            login=true;
            productInCart=await CartProduct.getOnlineOrderByUserId(req.userId);
            if(productInCart.length<=0){
                productInCart=false;
            }
        }
        else{
            login=false;
            productInCart=false;
        }

        const cate_id=getIDfrompath(req.path);
        const goodList=await Goods.getGoodsForCategory(cate_id);
        const categorylist=await Category.getAllCategory();
        res.render('customerView/buyForCategory.ejs',{
            data:goodList,
            categories:categorylist,
            isLogin:login,
            productInCart:productInCart,
            // pathNow:'/'+req.path
        })
    } catch (error) {
        console.log(error);
    }

    // console.log(req.path);
    // console.log(getIDfrompath(req.path))
    // res.send(""+req.path)
}

const deleteProductOutCart= async function(req,res){
    const gooddelete=req.params.goodid;
    const orderid=req.params.orderid;
    try {
        const deleteResult=await CartProduct.deleteProductOutCart(gooddelete,orderid);        
        res.status(200).send('xoa thành cong')

    } catch (error) {
        if (error) {
            console.log(error+'delelte fail!');            
        }
        res.status(500).send('xoa fail');
    }
}

const insertProductToCart= async function(req,res){
    try {
        const goodid=req.params.goodid;        
        let userName=req.username;
        // check login
        let login =false ; // inital
        // console.log(goodid);
        if(userName){ //logined
            // console.log(userName)
            // res.send(userName);
            const queryResult= await CartProduct.getNumPendingCart(userName);
            const numCart= Object.values(JSON.parse(JSON.stringify(queryResult)))[0]
            if(numCart.num==0){  // chưa có bảng
                
                // tao bang
                let userId= await UserMode.getUserIdByUsername(req.username);
                userId= Object.values(JSON.parse(JSON.stringify(userId)))[0].id;
                console.log(userId);
                const generateOrder= await CartProduct.createPendingOrder(userId);
                // res.status(200).send("ok")
                // return;
                // // them vao bang
                // res.status(200).send("da tao bang thanh cong");
                // console.log('them bang thanh cong')
                
            }
               //co bang rôi
                // console.log(numCart.num)
                // res.send("có bản rồi-"+numCart.num+'-');
                let orderPendingId= await CartProduct.getIdPendingCart(userName);
                orderPendingId=Object.values(JSON.parse(JSON.stringify(orderPendingId)))[0].id; // thong tin id bang pending
                // console.log(orderPendingId);
                

                // kiem tra xem hang co trong bang chua
                let productExist = await CartProduct.productExistInCart(orderPendingId,goodid);
                productExist=Object.values(JSON.parse(JSON.stringify(productExist)))[0].num;
               if(productExist==1){
                    res.status(200).send('no change since have inserted')   ;
                    return ;
               }
               else{
                //    console.log('inser');
                   // them hang vao bang
                   let insertToCart=await CartProduct.insertProductToCart(orderPendingId,goodid);
                   res.status(200).send('Sản phẩm đã được thêm');
                   return ;
               }

            

            // return ;
        }
        else{ // chua dang nhap
            // console.log('shiba wtf cache');
            // res.status(400).send("SOS");
            // return ;
            console.log(req.username);
            res.status(400).send("đăng nhập đi bạn êi");
        }
    } catch (error) {
        console.log(error);
    }
}

function getIDfrompath(path){
    path=''+path;
    return path.slice(10)
}

module.exports={
    buying,
    buyCategory,
    deleteProductOutCart,
    insertProductToCart,
}