const Order = require('../models/orderModel');
const GoodsInOrder = require('../models/goodsInOrderModel');
const Product = require('../models/productsModel');
const User = require('../models/userModel');
const ImportOrder = require('../models/importOdersModel');
const Category = require('../models/categoryModel');
const StaffInfo= require('../models/staffModel');
const ShiftInfo = require('../models/shiftModel');
const Schedule = require('../models/scheduleModel');
const moment = require('moment');

//convert time zone to gmt +7
function convertTZ(date) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}));   
}

//format time output
function formatTime(date){
    return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
}

function getDayOfMonth(month, year){
    month += 1;
    if(month == 2){
        if(year % 4 == 0){
            if(year % 100 == 0){
                if(year % 400 == 0) return 29;
                else return 28;
            } else return 29;
        } else return 28;
    }

    if([1,3,5,7,8,10,12].includes(month)) return 31;
    else return 30;
}


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

const loadDetailProduct = async (req, res)=>{
    const {id} = req.params;
    let data = {};
    try{
        //get product
        const product = await Product.getProductById(id);
        data.product = product[0];

        //get product name
        data.productName = product[0].name;

        //get product amount
        data.inventory = product[0].amount;

        //get total sell
        let totalSell = 0;
        const sellHistory = await GoodsInOrder.getGoodsById(id);
        for (var i = 0; i < sellHistory.length; i++) {
            const item = sellHistory[i];
            totalSell += item.amount * item.price;
        }
        data.totalSell = totalSell;

        //get total purchase
        let totalPurchase = 0;
        purchaseHistory = await ImportOrder.getOrdersByProductId(id);
        for (var j = 0; j < purchaseHistory.length; j++) {
            const item = purchaseHistory[j];
            totalPurchase += item.amount*item.price;
        }
        data.totalPurchase = totalPurchase;

        //get total income
        const totalIncomes = totalSell - totalPurchase;
        data.totalIncomes = totalIncomes;

        //get relative product
        const relativeProduct = await Product.getProductByCateGory(product[0].category);
        data.relativeProduct = relativeProduct;

        //get recent purchase
        const recentPurchase = await ImportOrder.getOrdersByProductId(id);
        data.recentPurchase = recentPurchase;
        for (var i = 0; i < data.recentPurchase.length; i++) {
            data.recentPurchase[i].time = convertTZ(data.recentPurchase[i].time);
            data.recentPurchase[i].time = formatTime(data.recentPurchase[i].time);
        }
        
        res.render('managerView/detailProduct', data);    
    }
    catch(error){
        if (error) {
            return res.status(500).json({message: error.message});
        }
    }
    
}

const updateProductPrice = async (req, res) => {
    const {id, value} = req.params;
    try{
        await Product.updatePrice(id, value);
        res.status(200).send(JSON.stringify({
            message: "The Product price has been updated.",
            type: 'price',
            newValue: value
        }));
    } catch(error){
        if(error) {
            console.log(error.message);
            return res.status(500).send(JSON.stringify({
                message: 'Server Error'
            }));
        }
            
    }
}

const updateDiscount = async (req, res) =>{
    const {id, value} = req.params;
    try{
        await Product.updateDiscount(id, value);
        res.status(200).send(JSON.stringify({
            message: "The product discount has been updated.",
            type: 'discount',
            newValue: value
        }));
    } catch(error){
        if(error){
            console.log(error.message);
            return res.status(500).send(JSON.stringify({
                message: "Server Error"
            }));
        }
    }
}

const updateBuyPrice = async (req,  res)=>{
    const {id, value} = req.params;
    try{
        await Product.updateBuyPrice(id, value);
        res.status(200).json({
            message: "Product's purchase price has been updated",
            type: 'buyPrice',
            newValue: value
        })
    } catch(error){
        if (error) {
            console.log(error.message);
            return res.status(500).json({
                message: "Server error, try it later"
            });
        }
    }
}


const getWeekData = async (req, res)=>{
    const {id} = req.params;
    try{
        
        let label = [];
        let buyData = [];
        let sellData = [];
        const now = new Date();
        const date = new Date();
        date.setHours(0,0,0,0);
        let day = date.getDay();
        if(day === 0) day = 8;
        const distance = day - 1;
        const from = new Date(date.getTime() - distance * 24*60*60*1000);
        
        for (var i = from.getTime(); i < now.getTime(); i += 24*60*60*1000) {
            //set label
            let moment = new Date(i);
            moment = convertTZ(moment);
            label.push(formatTime(moment));

            //set buy value
            const orders = await ImportOrder.getOrdersByTimeId(i, i+24*60*60*1000, id);
            let value = 0;
            for (var k = 0; k < orders.length; k++) {
                const item = orders[k];
                value += item.price*item.amount;
            }
            buyData.push(value);

            //set sell values
            const sellOrders = await Order.getAllOrdersByTime(i, i+24*60*60*1000);
            let proInOrder = [];
            for (var j = 0; j < sellOrders.length; j++) {
                const order = sellOrders[j];
                const goods = await GoodsInOrder.getGoodsInOrderById(order, id);
                proInOrder = [...proInOrder, ...goods];
            }
            let value1 = 0;
            for (var l = 0; l < proInOrder.length; l++) {
                value1 += proInOrder[l].price * proInOrder[l].amount;
            }
            sellData.push(value1);
        }

        res.json({
            message: 'OK',
            type: 'week',
            label: label,
            buyData: buyData,
            sellData: sellData
        })

    } catch(error){
        if(error){
            console.log(error.message);
            res.status(500).json({
                message: "Server error. Try it later."
            })
        }
    }
}

const getMonthData = async (req, res)=>{
    const {id} = req.params;
    
    try{
        
        let label = [];
        let buyData = [];
        let sellData = [];
        const now = new Date();
        const date = new Date();
        date.setHours(0,0,0,0);
        date.setDate(1);
        let day = date.getDate();

        //get the first day of month
        const from = date;

        for (var i = from.getTime(); i < now.getTime(); i += 3*24*60*60*1000) {
            //set label
            let moment = new Date(i);
            moment = convertTZ(moment);
            label.push(formatTime(moment));

            //set buy value
            const orders = await ImportOrder.getOrdersByTimeId(i, i+3*24*60*60*1000, id);
            
            let value = 0;
            for (var k = 0; k < orders.length; k++) {
                const item = orders[k];
                value += item.price*item.amount;
            }
            buyData.push(value);

            //set sell values
            const sellOrders = await Order.getAllOrdersByTime(i, i+3*24*60*60*1000);
            let proInOrder = [];
            for (var j = 0; j < sellOrders.length; j++) {
                const order = sellOrders[j];
                const goods = await GoodsInOrder.getGoodsInOrderById(order, id);
                proInOrder = [...proInOrder, ...goods];
            }
            let value1 = 0;
            for (var l = 0; l < proInOrder.length; l++) {
                value1 += proInOrder[l].price * proInOrder[l].amount;
            }
            sellData.push(value1);
        }

        res.json({
            message: 'OK',
            type: 'month',
            label: label,
            buyData: buyData,
            sellData: sellData
        })

    } catch(error){
        if(error){
            console.log(error.message);
            res.status(500).json({
                message: "Server error. Try it later."
            })
        }
    }
}

const getYearData = async (req, res)=>{
    const {id} = req.params;
    try{
        
        let label = [];
        let buyData = [];
        let sellData = [];
        const now = new Date();
        const date = new Date();
        date.setHours(0,0,0,0);
        date.setMonth(0);
        date.setDate(1);

        //get the first day of month
        const from = date;

        let i = 0;
        let time = from.getTime();
        while(i<=11){
            //set label
            let moment = convertTZ(new Date(time));
            label.push(formatTime(moment));

            //set buy value
            const orders = await ImportOrder.getOrdersByTimeId(time, time+getDayOfMonth(i)*24*60*60*1000, id);
            
            let value = 0;
            for (var k = 0; k < orders.length; k++){
                const item = orders[k];
                value += item.price*item.amount;
            }
            buyData.push(value);

            //set sell values
            const sellOrders = await Order.getAllOrdersByTime(time, time+getDayOfMonth(i)*24*60*60*1000);
            let proInOrder = [];
            for (var j = 0; j < sellOrders.length; j++) {
                const order = sellOrders[j];
                const goods = await GoodsInOrder.getGoodsInOrderById(order,id);
                proInOrder = [...proInOrder, ...goods];
            }
            let value1 = 0;
            for (var l = 0; l < proInOrder.length; l++) {
                
                value1 += proInOrder[l].price * proInOrder[l].amount;
            }
            sellData.push(value1);
            time += getDayOfMonth(i)*24*60*60*1000;
            i++;
        }

        res.json({
            message: 'OK',
            type: 'year',
            label: label,
            buyData: buyData,
            sellData: sellData
        })

    } catch(error){
        if(error){
            console.log(error.message);
            res.status(500).json({
                message: "Server error. Try it later."
            })
        }
    }
}

const getAllProduct = async (req, res)=>{
    try{
        const data = await Product.getAllProduct();
        res.status(200).json(data);
    }catch(error){
        console.log(error.message);
        res.status(500).json({
            message: 'Server error'
        })
    }
}

const getSchedule = async (req, res)=>{
    try{
        
        const schedule = await Schedule.getScheduleAll();
        const staff = await StaffInfo.pullData();
        res.status(200).json({
            message: "ok",
            schedules: schedule,
            staffs: staff
        })
    } catch(error){
        console.log(error.message);
        res.status(500).json({
            message: "Server error, try it later."
        })
    }
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
    loadDetailProduct,
    updateProductPrice,
    updateDiscount,
    updateBuyPrice,
    getWeekData,
    getMonthData,
    getYearData,
    getAllProduct,
    getSchedule
}