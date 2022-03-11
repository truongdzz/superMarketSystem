
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3500; 

//middleware
app.use(express.static('./public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//view engine
app.set('view engine', 'ejs');
app.set('views', './views')

// //loginRouter
// const loginRouter = require('./routers/loginRouter');
// app.use('/login', loginRouter);

// //admin Router
// const adminRouter = require('./routers/adminRouter/adminRouter');
// app.use('/admin', adminRouter);

// //staffRouter
// const staffRouter = require('./routers/staffRouter');
// app.use('/staff', staffRouter);

// //cashierRouter
// const cashierRouter = require('./routers/cashierRouter');
// app.use('/cashier', cashierRouter);

// //userRouter
// const userRouter = require('./routers/userRouter');
// app.use('/user', userRouter);

app.get('/', (req, res)=>{
    res.render('customerView/index.ejs', {name: 'alice', pass: '123'});
})


//create server
app.listen(PORT, ()=>{
    console.log(`Server is listening to port ${PORT}`);
})

//test