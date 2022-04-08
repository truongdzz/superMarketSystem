const Order = require('../models/orderModel');
const GoodsInOrder = require('../models/goodsInOrderModel');
const Product = require('../models/productsModel');
const User = require('../models/userModel');
const ImportOrder = require('../models/importOdersModel');
const Category = require('../models/categoryModel');
const StaffInfo = require('../models/staffModel')
const ShiftInfo = require('../models/shiftModel')


var moment = require('moment');
const { json } = require('express/lib/response');

const getPage = async(req, res) => {
    try {
        let Data = function() {
            this.products = null;
        };
        data = new Data;

        result = []
        const products = await Product.getAllProduct();
        data.products = products;
        res.render('wareView/wareStaff.ejs', { data: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const updateproduct = async(req, res) => {

    try {
        const { productid, tensp, amount, position, price } = req.query;
        Product.updateproduct(productid, tensp, amount, position, price)
        res.redirect('/ware')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const addproduct = async(req, res) => {

    try {
        const { image, addname, addamount, addposition, addprice } = req.query;
        Product.addproduct(image, addname, addamount, addposition, addprice)
        res.redirect('/ware')
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const importproduct = async(req, res) => {

    try {
        const { imid, imamount } = req.query;
        const staff_id = req.staffid;
        Product.addproduct(imid, imamount, staff_id);
        res.redirect('/ware');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const deleteproduct = async(req, res) => {

    try {
        const pid = req.params.id;
        Product.deleteproduct(pid);
        res.redirect('/ware');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}




module.exports = {
    getPage,
    updateproduct,
    addproduct,
    importproduct,
    deleteproduct
}