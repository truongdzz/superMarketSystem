const Order = require('../models/orderModel');
const GoodsInOrder = require('../models/goodsInOrderModel');
const Product = require('../models/productsModel');
const User = require('../models/userModel');
const ImportOrder = require('../models/importOdersModel');
const Category = require('../models/categoryModel');
const StaffInfo= require('../models/staffModel');
const ShiftInfo = require('../models/shiftModel');
const moment = require('moment');

const loadDashboard = async (req, res) => {
    try {
        let Data = function () {
            this.totalSales = 0;
            this.totalExpenses = 0;
            this.totalIncomes = 0;
            this.newOrders = 0;
            this.ordersInfo = null;
            this.analytic = null;
        };
        const data = new Data;
        const ordersIn24h = await Order.pullDataByTime(24);
        data.newOrders = ordersIn24h.length;
        data.ordersInfo = ordersIn24h.reverse();
        for (let index = 0; index < ordersIn24h.length; index++) {
            const order = ordersIn24h[index];
            const goodsInOrder = await GoodsInOrder.getGoodsInOrder(order);
            for (let index = 0; index < goodsInOrder.length; index++) {
                const goodsInOrderDetail = goodsInOrder[index];
                const product = await Product.getProductById(goodsInOrderDetail.goodID);
                data.totalSales += product[0].sellPrice * goodsInOrderDetail.amount;
                data.totalExpenses += product[0].buyPrice * goodsInOrderDetail.amount;
                data.totalIncomes += (product[0].sellPrice - product[0].buyPrice) * goodsInOrderDetail.amount;
            }
        }

        const onlineOrder24h = await Order.getOnlineOrdersByTime(24);
        const offlineOrder24h = await Order.getOfflineOrdersByTime(24);
        const onlineOrder48h = await Order.getOnlineOrdersByTime(48);
        const offlineOrder48h = await Order.getOfflineOrdersByTime(48);
        const user24h = await User.getUserByTime(24);
        const user48h = await User.getUserByTime(48);

        const analytic = {
            online24: onlineOrder24h.length,
            onlinePercent: (100 * (onlineOrder24h.length - ((onlineOrder48h.length - onlineOrder24h.length) || 0)) / ((onlineOrder48h.length - onlineOrder24h.length) || 1)).toFixed(0),
            offline24: offlineOrder24h.length,
            offlinePercent: (100 * (offlineOrder24h.length - ((offlineOrder48h.length - offlineOrder24h.length) || 0)) / ((offlineOrder48h.length - offlineOrder24h.length) || 1)).toFixed(0),
            user24: user24h.length,
            userPercent: (100 * (user24h.length - ((user48h.length - user24h.length) || 0)) / ((user48h.length - user24h.length) || 1)).toFixed(0)
        }

        data.analytic = analytic;

        return res.render('managerView/dashboard.ejs', { data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loadStatisticPage = (req, res) => {
    res.render('managerView/statistic.ejs');
}

const getBuyAndSaleDataByTime = async (req, res) => {
    const { from, to, step } = req.query;
    if (Number(from) >= Number(to)) return res.sendStatus(304);

    //truc thoi gian trong do thi
    let data = [];
    for (let index = Number(from); index < Number(to); index += Number(step)) {
        data = [...data, String(index)];
    }
    const datastring = data.map(piece => {
        const day = new Date(Number(piece) - 8 * 60 * 60 * 1000);
        const str = (Number(step) >= 24 * 60 * 60 * 1000) ?
            (day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate()) :
            (day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate() + " " + day.getHours() + ":00:00");
        return str;
    })


    try {
        let buyValue = []; 
        let sellValue = [];
        for (let index = Number(from); index < Number(to); index += Number(step)) {
            let valueBuy = 0;
            const buyOrderList = await ImportOrder.getOrdersByTime(index, index + Number(step));
            if (buyOrderList.length !== 0) {
                for (let index = 0; index < buyOrderList.length; index++) {
                    const order = buyOrderList[index];
                    const product = await Product.getProductById(order.good);
                    if (order && product) {
                        valueBuy += Number(order.amount * product[0].buyPrice);
                    }
                }
            }
            buyValue = [...buyValue, valueBuy];

            let valueSell = 0;
            const sellOrderList = await Order.getAllOrdersByTime(index, index+Number(step));
            for (let index = 0; index < sellOrderList.length; index++) {
                const order = sellOrderList[index];
                const listProductInOrder = await GoodsInOrder.getGoodsInOrder(order);
                for (let index = 0; index < listProductInOrder.length; index++) {
                    const productInOrder = listProductInOrder[index];
                    const product = await Product.getProductById(productInOrder.goodID);
                    
                    valueSell += productInOrder.amount * product[0].sellPrice;
                }
            }
            sellValue = [...sellValue, valueSell];
        }
        const result = {
            data: datastring,
            buyValue: buyValue,
            sellValue: sellValue
        }
        res.send(JSON.stringify(result));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getLeadProduct = async (req, res) => {
    const {from, to} = req.query;
    const fromDate = new Date(Number(from)).getTime();
    const toDate = new Date(Number(to)).getTime();

    try {
        let data = [];
        let value = [];
        const orderList = await Order.getAllOrdersByTime(fromDate, toDate);
        for (let index = 0; index < orderList.length; index++) {
            const order = orderList[index];
            const goodsInOrder = await GoodsInOrder.getGoodsInOrder(order);
            for (let index1 = 0; index1 < goodsInOrder.length; index1++) {
                const good = goodsInOrder[index1];
                const product = await Product.getProductById(good.goodID);
                const match = data.indexOf(product[0].id);
                if(match === -1){
                    data = [...data, product[0].id];
                    value = [...value, ((product[0].sellPrice - product[0].buyPrice) * good.amount)];
                } else {
                    value[match] += ((product[0].sellPrice - product[0].buyPrice) * good.amount);
                }
            }
        }
        const result = {
            data: data,
            value: value
        };
        
        res.send(JSON.stringify(result));
    } catch (error) {
        if(error) res.status(500).json({message: error.message});
    }
}

const getLeadCategory = async (req, res)=>{
    const {from, to} = req.query;
    const fromDate = new Date(Number(from)).getTime();
    const toDate = new Date(Number(to)).getTime();
    try {
        let name = [];
        let value = [];
        let data = [];
        const orderList = await Order.getAllOrdersByTime(fromDate, toDate);
        for (let index = 0; index < orderList.length; index++) {
            const order = orderList[index];
            const goodsInOrder = await GoodsInOrder.getGoodsInOrder(order);
            for (let index1 = 0; index1 < goodsInOrder.length; index1++) {
                const good = goodsInOrder[index1];
                const product = await Product.getProductById(good.goodID);
                const money = (product[0].sellPrice - product[0].buyPrice) * good.amount;
                const category = await Category.getCategoryById(product[0].category);
                const match = name.indexOf(category[0].name);
                if(match === -1){
                    name = [...name, category[0].name];
                    value = [...value, money];
                } else {
                    value[match] += money;
                }
            }
        }
        for (let index = 0; index < name.length; index++) {
            const ten = name[index];
            data = [...data, {name: ten, value: value[index]}];
        }
        
        res.send(JSON.stringify(data));
    } catch (error) {
        if(error) res.status(500).json({message: error.message});
    }
}

const getShiftManager = async(req, res) => {
    try {
        let Data = function() {
            this.shiftinfo = null;
        };
        data = new Data;

        result = []
        const shiftinfo = await ShiftInfo.pullData();
        data.shiftinfo = shiftinfo;
        // for (let index = 0; index < staffinfo.length; index++) {
        //     data.id = staffinfo[index].id;
        //     data.staffname = staffinfo[index].name;
        //     data.position = staffinfo[index].role;
        //     result = [...result, data];
        // }

        // res.send(JSON.stringify(data));


        res.render('managerView/shift_manager.ejs', { data: data, moment: moment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}
const getHourStatistic = (req, res) => {
    res.render('managerView/hour_statistic.ejs');
}
const getStaffManager = async(req, res) => {
    try {
        let Data = function() {
            this.staffinfo = null;
            this.recentstaff = null;
        };
        data = new Data;

        result = []
        const staffinfo = await StaffInfo.pullData();
        const recentstaff = await StaffInfo.recentStaff();
        data.staffinfo = staffinfo;
        data.recentstaff = recentstaff;
        // for (let index = 0; index < staffinfo.length; index++) {
        //     data.id = staffinfo[index].id;
        //     data.staffname = staffinfo[index].name;
        //     data.position = staffinfo[index].role;
        //     result = [...result, data];
        // }

        // res.send(JSON.stringify(data));


        res.render('managerView/staff_manager', { data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


const loadDetailOrder = async (req, res)=>{
    const {id} = req.params;
    try {
        //get current order
        const order = await Order.getOrderById(id);

        //get customer of the order
        const customer = await User.getUserById(order[0].userid);

        //get all order of that customer
        const recentOrders = await Order.getOrdersByUserId(order[0].userid);

        //get his ten last order
        let recentTenOrders= recentOrders.slice(-10);
        recentTenOrders = recentTenOrders.reverse();

        //get product in current order
        const productInOrder = await GoodsInOrder.getGoodsInOrder(order[0]);
        
        let productList = [];
        for (var i = 0; i < productInOrder.length; i++) {
            const item = productInOrder[i];
            const pro = await Product.getProductById(item.goodID);
            const product = pro[0];
            product.amount = item.amount;
            product.total = product.amount * product.sellPrice * (100-product.discount) / 100;
            productList.push(product);
        }
        console.log(productList);


        const data = {
            userInfo: customer[0],
            recentOrders: recentTenOrders,
            billInfo: order[0],
            products: productList
        }

        return res.render('managerView/detailOrder', data);    
    } catch (error){
        return res.status(500).json({message: error.message})
    }
    
}

const loadDetailProduct = (req, res)=>{
    res.render('managerView/detailProduct');
}


module.exports = {
    loadDashboard,
    loadStatisticPage,
    getBuyAndSaleDataByTime,
    getLeadProduct,
    getLeadCategory,
    getShiftManager,
    getHourStatistic,
    getStaffManager,
    loadDetailOrder,
    loadDetailProduct
}