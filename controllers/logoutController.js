const usersDB = require('../models/userModel');
const staffDB = require('../models/staffModel');

const handleUserLogout = async (req, res) => {
    //delete the refresh token on client and db

    //get the cookies
    const cookies = req.cookies;
    //check if there is a freshtoken in the cookie
    if (!cookies?.jwt) return res.status(204).json({ message: 'No content' });
    //if yes, find the person has that cookie and clear it
    //get the cookie
    const refreshToken = cookies.jwt;

    try {
        const usersData = await usersDB.pullData();
        //find the person
        const foundUser = usersData.find(person => person.refreshToken === refreshToken);
        //if there is no person with that refresh token
        if (!foundUser) {
            //clear the cookie at client
            res.clearCookie('jwt', { httpOnly: true, maxAges: 24 * 60 * 60 * 1000 });
            return res.status(204).json({ message: 'No content' })
        } else {
            // clear refresh token in db
            usersDB.clearRefreshToken(foundUser, (err, message) => {
                if (err) console.log(err);
            });
            res.clearCookie('jwt', { httpOnly: true, maxAges: 24 * 60 * 60 * 1000 });
            res.clearCookie('accessToken',{ httpOnly: true, maxAges: 15 * 60 * 60 * 1000 })
            // res.status(204).json({ message: 'Logout sucess' });
            console.log('Logout success');
            res.redirect('/');
        }


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const handleStaffLogout = async (req, res) => {
    //delete the refresh token on client and db

    //get the cookies
    const cookies = req.cookies;
    //check if there is a freshtoken in the cookie
    if (!cookies?.jwt) return res.status(204).json({ message: 'No content' });
    //if yes, find the person has that cookie and clear it
    //get the cookie
    const refreshToken = cookies.jwt;

    try {
        const staffData = await staffDB.pullData();
        //find the person
        const foundStaff = staffData.find(person => person.refreshToken === refreshToken);
        //if there is no person with that refresh token
        if (!foundStaff) {
            //clear the cookie at client
            res.clearCookie('jwt', { httpOnly: true, maxAges: 24 * 60 * 60 * 1000 });
            return res.status(204).json({ message: 'No content' })
        } else {
            // clear refresh token in db
            staffDB.clearRefreshToken(foundStaff, (err, message) => {
                if (err) console.log(err);
            });
            res.clearCookie('jwt', { httpOnly: true, maxAges: 24 * 60 * 60 * 1000 });
            res.status(204).json({ message: 'Logout sucess' });
            console.log('Logout success');
        }


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    handleUserLogout,
    handleStaffLogout
}