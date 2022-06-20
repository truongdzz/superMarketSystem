const Goods=require('../models/goodsModel');
const Category=require('../models/categoryModel');
const CartProduct=require('../models/orderModel');
const UserMode=require('../models/userModel');
// const req = require('express/lib/request');



const UserBanner=async(req,res)=>{
    try {
        let login=false;
        let productInCart;
        let username=req.username;
        let userbanner ='';
        if(username){
            login=true;
            productInCart=await CartProduct.getOnlineOrderByUserId(req.userId);
             ('no-'+req.userId);
            let nameOfUser = await UserMode.getUserNameById(req.userId);
            nameOfUser = Object.values(JSON.parse(JSON.stringify(nameOfUser)))[0].name
            if(productInCart.length<=0){
                productInCart=false;
            }

            userbanner = {
                isLogin:login,
                productInCart:productInCart,
                nameOfUser:nameOfUser,
            }
        }
        else{
            login=false;
            productInCart=false;
            userbanner = {
                isLogin:login,
                productInCart:productInCart,
            }
        }

         (userbanner);
        return userbanner;


    } catch (error) {
        console.log(error)
    }
}

const buying=async (req,res)=>{
    try {
        
        const goodList=await Goods.getALLgoods();
        const categorylist=await Category.getAllCategory();
        const usernoti = await UserMode.getNoti(req.userId);
        const temp1= await UserBanner(req,res);
        const temp2={
            data:goodList,
            categories:categorylist,
        }
        res.render('customerView/index.ejs',{
            ...temp1,
            ...temp2,
            noti: usernoti
        })

    } catch (error) {
        console.log(error)
    }

}

const buyCategory=async (req,res)=>{
    try {

        
        const cate_id=getIDfrompath(req.path);
        const goodList=await Goods.getGoodsForCategory(cate_id);
        const categorylist=await Category.getAllCategory();
        const temp1= await UserBanner(req,res);
        const temp2={
            data:goodList,
            categories:categorylist,
            categoryId:cate_id,
        }
        const usernoti = await UserMode.getNoti(req.userId);

        res.render('customerView/buyForCategory.ejs',{
           ...temp1,
           ...temp2,
           noti: usernoti
        })

       
    } catch (error) {
        console.log(error);
    }

}

const deleteProductOutCart= async function(req,res){
    const gooddelete=req.params.goodid;
    const orderid=req.params.orderid;
     (orderid);
    const quantity=req.params.quantity;
     (quantity)
    try {
        const deleteResult=await CartProduct.deleteProductOutCart(gooddelete,orderid);   
        // them vao nha
        Goods.increasingProductByNum(gooddelete,quantity)   ;

        // get product in cart after delete
        let num = await CartProduct.numberProductInCart(orderid);
        num = Object.values(JSON.parse(JSON.stringify(num)))[0].num
         (num);

        if(num==0){
             (orderid);
            await CartProduct.deleteOrderById(orderid);
            res.status(200).redirect('/');
            return;

        }

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
         (goodid);
        if(userName){ //logined
             (userName)
            // res.send(userName);
            const queryResult= await CartProduct.getNumPendingCart(userName);
            const numCart= Object.values(JSON.parse(JSON.stringify(queryResult)))[0]
            if(numCart.num==0){  // chưa có bảng
                
                // tao bang
                let userId= await UserMode.getUserIdByUsername(req.username);
                userId= Object.values(JSON.parse(JSON.stringify(userId)))[0].id;
                 (userId);
                const generateOrder= await CartProduct.createPendingOrder(userId);
                // // them vao bang

                
            }
               //co bang rôi

                let orderPendingId= await CartProduct.getIdPendingCart(userName);
                orderPendingId=Object.values(JSON.parse(JSON.stringify(orderPendingId)))[0].id; // thong tin id bang pending
               
                

                // kiem tra xem hang co trong bang chua
                let productExist = await CartProduct.productExistInCart(orderPendingId,goodid);
                productExist=Object.values(JSON.parse(JSON.stringify(productExist)))[0].num;
               if(productExist==1){
                    res.status(200).send('no change since have inserted')   ;
                    return ;
               }
               else{
                   let priceOfGood= await Goods.getSellPriceFromGoodId(goodid);
                   priceOfGood=Object.values(JSON.parse(JSON.stringify(priceOfGood)))[0].sellPrice;
                
                   // them hang vao bang
                   await CartProduct.insertProductToCart(orderPendingId,goodid,priceOfGood);
                   await Goods.decreasingProductByOne(goodid); // them moi nha
                //    price=await CartProduct.getPriceOfOrder(userid);
                //     price=Object.values(JSON.parse(JSON.stringify(price)))[0].price;
                //     CartProduct.updatePriceInOrder(orderid,price);
                 
                   res.status(200).send('Sản phẩm đã được thêm');
                   return ;
               }

            

            // return ;
        }
        else{ // chua dang nhap
            res.status(400).send("Bạn cần phải đăng nhập để tiếp tục mua hàng"); // them moi nha
        }
    } catch (error) {
        console.log(error);
    }
}
function getIDfrompath(path){
    path=''+path;
    return path.slice(10)
}


const cartpage=async (req,res)=>{
    try {

        if(!req.username){
            res.redirect('/');
            return;
        }
        const temp1= await UserBanner(req,res); // banner

        let username=req.username;
        let userid =await UserMode.getUserIdByUsername(username);
        userid=Object.values(JSON.parse(JSON.stringify(userid)))[0].id; //userid


        let productlist;
        
        let temp_={
            price:0,
            shipfee:0,
            totalprice:0,
            check:false,
        }

        let numOfPendingCart= await CartProduct.getNumPendingCart(username);
        numOfPendingCart=Object.values(JSON.parse(JSON.stringify(numOfPendingCart)))[0].num;
        if(numOfPendingCart<=0){

            res.redirect('/');
            return;
        }

        let orderID=await CartProduct.OrderIDfromUserid(userid); // orderid
        orderID=Object.values(JSON.parse(JSON.stringify(orderID)))[0].id;

        let numOfProduct=await CartProduct.numberProductInCart(orderID);
        numOfProduct=Object.values(JSON.parse(JSON.stringify(numOfProduct)))[0].num;

        if(numOfProduct<0){
            res.redirect('/');
            return;
        }


        let price=0;
        if(numOfProduct>0 && numOfPendingCart>0){
            price=await CartProduct.getPriceOfOrder(userid);
            price=Object.values(JSON.parse(JSON.stringify(price)))[0].price;
            CartProduct.updatePriceInOrder(orderID,price);
            productlist=await CartProduct.getOnlineOrderByUserId(userid);
        }

        let shipfee=0;
        let totalprice =price+shipfee
        let temp2={
            productlist:productlist
        }
        let temp3={
            price,
            shipfee,
            totalprice,
            check:true,
        }
        const usernoti = await UserMode.getNoti(req.userId);
        res.render('customerView/usercart.ejs',{
            ...temp1,
            ...temp2,
            ...temp3,
            noti: usernoti
        });
    } catch (error) {
        console.log(error)
    }
}

const increasingProductTocart=async function (req,res){
    let goodid=req.params.goodid;
    let orderid=req.params.orderid;
    let quantity=req.params.quantity;
    const updatecart =await CartProduct.updateQuantityInOrder(goodid,orderid,quantity);
    Goods.decreasingProductByOne(goodid);

    let username=req.username;
    let userid =await UserMode.getUserIdByUsername(username);
    userid=Object.values(JSON.parse(JSON.stringify(userid)))[0].id; //userid

    price=await CartProduct.getPriceOfOrder(userid);
    price=Object.values(JSON.parse(JSON.stringify(price)))[0].price;
    CartProduct.updatePriceInOrder(orderid,price);

    
    res.status(200).send(''+price);
}

const decreasingProductTocart=async function(req,res){
    let goodid=req.params.goodid;
    let orderid=req.params.orderid;
    let quantity=req.params.quantity;
    const updatecart =await CartProduct.updateQuantityInOrder(goodid,orderid,quantity);
    Goods.increasingProductByOne(goodid);

    let username=req.username;
    let userid =await UserMode.getUserIdByUsername(username);
    userid=Object.values(JSON.parse(JSON.stringify(userid)))[0].id; //userid

    price=await CartProduct.getPriceOfOrder(userid);
    price=Object.values(JSON.parse(JSON.stringify(price)))[0].price;
    CartProduct.updatePriceInOrder(orderid,price);

    res.status(200).send(''+price);
}

const changestatusOrder = async function(req,res){
    let orderID=req.params.orderID;
    const result = await CartProduct.changestatusorder(orderID);
    if(result){
        res.redirect('/');
    }
}

const sortProductdecreasingALL =async function(req,res){
    const goodList=await Goods.sortProductByPrice(-1);
    res.status(200).send(goodList);
}
const sortProductincreasingALL =async function(req,res){
    const goodList=await Goods.sortProductByPrice(1);
    res.status(200).send(goodList);
}

const sortProductincreasingBycategory=async function(req,res){
    const categoryId= req.params.catergoryId;
     (categoryId);
    const goodList=await Goods.sortProductByPrice(1,categoryId);
     (goodList);
    res.status(200).send(goodList);
}
const sortProductdecreasingBycategory=async function(req,res){
    const categoryId= req.params.catergoryId;
    const goodList=await Goods.sortProductByPrice(-1,categoryId);
    res.status(200).send(goodList);
}


module.exports={
    buying,
    buyCategory,
    deleteProductOutCart,
    insertProductToCart,
    cartpage,
    increasingProductTocart,
    decreasingProductTocart,
    changestatusOrder,
    sortProductdecreasingALL,
    sortProductincreasingALL,
    sortProductincreasingBycategory,
    sortProductdecreasingBycategory,

}
