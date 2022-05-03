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
    const { search } = req.query
    if (search) {
        try {
            let Data = function() {
                this.products = null;
                this.cate = "all";
            };
            data = new Data;

            result = []
            const products = await Product.searchproduct(search);
            data.products = products;
            res.render('wareView/wareStaff.ejs', { data: data });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    } else {
        try {
            let Data = function() {
                this.products = null;
                this.cate = "all";
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

}

const searchproduct = async(req, res) => {
    const { search } = req.query
    if (search) {
        const products = await Product.searchproduct(search);
        res.send(JSON.stringify(products));
    }
}

const postPage = async(req, res) => {
    try {

        const { cat } = req.body;
        if (cat == "11") res.redirect('/ware/getPage/')
        let Data = function() {
            this.products = null;
            this.cate = "";
        };
        data = new Data;

        const products = await Product.getProductByCateGory(cat);
        data.products = products;
        data.cate = cat;
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
    ////update
const addproduct = async(req, res) => {

        try {
            const { image, addname, addamount, addpos, addcat, addprice } = req.query;
            Product.addproduct(image, addname, addamount, addpos, addcat, addprice)
            res.redirect('/ware')
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    }
    /////////////
const importproduct = async(req, res) => {

    try {
        var { imid, imamount, imamount1 } = req.query;
        var staff_id = req.staffid || 1;
        imamount1 = Number(imamount) + Number(imamount1);
        Product.importproduct(imid, imamount, imamount1, staff_id);
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
    deleteproduct,
    postPage,
    searchproduct,
}