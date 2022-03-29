const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500; 

//middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

//connect database
const database = require('./models/configDB');
database.connect(function(err){
    if (err) throw err;
    console.log('Connected to database!');
}) 

//view engine
app.set('view engine', 'ejs');
app.set('views', './views')

//loginRouter
const authRouter = require('./routers/authRouter');
app.use('/login', authRouter);

//logout router
const logoutRouter = require('./routers/logoutRouter');
app.use('/logout', logoutRouter);

//registerRouter
const registerRouter = require('./routers/registerRouter');
app.use('/register', registerRouter);

//refresh router
const refreshRouter = require('./routers/refreshRouter');
app.use('/refresh', refreshRouter)

//admin Router
const adminRouter = require('./routers/adminRouter');
app.use('/admin', adminRouter);

// //staffRouter
// const staffRouter = require('./routers/staffRouter');
// app.use('/staff', staffRouter);

//cashierRouter
const cashierRouter = require('./routers/cashierRouter');
app.use('/cashier', cashierRouter);

// //userRouter
// const userRouter = require('./routers/userRouter');
// app.use('/user', userRouter);
const userRouter=require('./routers/userRouter');
app.use('/',userRouter);

 
//create server
app.listen(PORT, ()=>{
    console.log(`Server is listening to port ${PORT}`);
})