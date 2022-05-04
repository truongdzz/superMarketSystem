const db = require('./configDB');

let ShiftInfo = function(shift) {
    this.number = shift.number;
};

ShiftInfo.pullData = () => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM shift";
        db.query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

ShiftInfo.getShiftByNumber = (number) => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM shift WHERE `number` = ?";
        db.query(sql, number, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;   
}

module.exports = ShiftInfo;