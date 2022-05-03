const Goods = require('../models/goodsModel');
const Category = require('../models/categoryModel');

const buying = async(req, res) => {
    try {
        const goodList = await Goods.getALLgoods();
        const categorylist = await Category.getAllCategory();

        res.render('customerView/index.ejs', {
            data: goodList,
            categories: categorylist
        });
    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    buying
}