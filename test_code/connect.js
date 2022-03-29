const mysql=require('mysql');

var connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'shibamarket',
});

connection.connection(function(err){
    if(err) console.log('ket noi toang')
});

module.exports=connection;