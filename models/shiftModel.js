const db = require('./configDB');

let ShiftInfo = function(shift) {
    this.number = shift.number;
    this.name = shift.name;
    this.phonenum = shift.phonenum;
    this.status = shift.status;

};

ShiftInfo.pullData = () => {
    const promise = new Promise((resolve, reject) => {
        const sql = "SELECT * FROM shift ORDER BY number ASC";
        db.query(sql, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    })
    return promise;
}

module.exports = ShiftInfo;