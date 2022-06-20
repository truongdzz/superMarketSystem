const mysql = require('mysql');
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'shibamarket'
    }
)

module.exports = connection