const User = require('../models/userModel');
const Product = require('../models/productsModel');
const Order = require('../models/orderModel');
const GoodsInOrder = require('../models/goodsInOrderModel');
const bcrypt = require('bcrypt');

const loadCashierPage = (req, res) => {
    res.render('cashierView/index.ejs');
}

const getAllProduct = async (req, res) => {
    try {
        const allProduct = await Product.getAllProduct();
        res.send(JSON.stringify(allProduct));
    } catch (error) {
        if (error) res.status(500).json({ message: error.message });
    }
}

const getUserInfo = async (req, res) => {
    const { phone } = req.query;
    try {
        const userInfo = await User.getUserByPhone(phone);
        if (!userInfo) res.send("")
        else res.send(JSON.stringify(userInfo[0]));
    } catch (error) {
        if (error) res.status(400).json({ message: error.message })
    }
}

const checkout = async (req, res) => {
    const addedProduct = JSON.parse(req.body.data);
    const userInfo = JSON.parse(req.body.userInfo);
    //create new user if yes
    let insertedUserId;
    try {
        if (userInfo.newUser) {
            insertedUserId = await handleNewUser(userInfo.name, userInfo.username, userInfo.phone, userInfo.password);
        }

        console.log(insertedUserId);
        console.log("staffid: ");
        console.log(req.staffid);
        //create new order
        const order = {
            userid: insertedUserId,
            type: "offline",
            staffid: req.staffid,
            status: "delivered"
        }

        let insertedOrderId;
        const data = await Order.createNewOrder(order);
        insertedOrderId = data.insertId;

        //insert product in order && update product amount
        for (let index = 0; index < addedProduct.length; index++) {
            const product = addedProduct[index];
            const goodsInOrder = {
                goodID: product.id,
                amount: product.amount,
                orderID: insertedOrderId
            };
            //insert product in order
            GoodsInOrder.createNew(goodsInOrder, (err, data) => {
                if (err) console.log(err);
            })
            //update product amount
            Product.upadteAmount(product, (err, data) => {
                if (err) console.log(err);
            })
        }

        res.json({ message: "checkout success" });
    } catch (error) {
        res.json({message: error.message});
    }

}

const handleNewUser = async (name, username, phone, password) => {
    // check username and password
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required!' });
    }
    let userid;
    try {

        //check for duplicate username in db
        const userlist = await User.pullData();
        const isDuplicate = userlist.find(person => person.username === username);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Username already exist!' });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //store the new user
        const newUser = 
            {
                name: name,
                username: username,
                phone: phone,
                password: hashedPassword,
                role: 'user'
            };

        //write to database
        const data =  await User.createUser(newUser);

        return data;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadCashierPage,
    getAllProduct,
    getUserInfo,
    checkout
}