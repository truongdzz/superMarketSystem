const User = require('../models/userModel');
const Staff = require('../models/staffModel');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, username, phone, password } = req.body;
    // check username and password
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required!' });
    }
        
    try {
            
        //check for duplicate username in db
        const userlist = await User.pullData();
        const isDuplicate = userlist.find(person => person.username === username);
        if (isDuplicate) {
            return res.status(409).json({ message: 'Username already exist!' });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //store the new user
        const newUser =
            {
                name: name,
                username: username,
                phone: phone,
                password: hashedPassword,
                role: 'user'
            };
        
        //write to database
        const data =  User.createUser(newUser);

        res.status(201).json({ message: `New user ${username} created` })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const handleNewStaff = async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username and password and role are required.' });
    }
    
    try {
        //check duplicate staff
        const staffname = await Staff.pullData();
        const isDuplicate = staffname.find(staff => staff.username === username);
        if(isDuplicate) return res.status(409).json({message: `Username ${username} already exist.`});

        //hash the password
        const hashedPwd = await bcrypt.hash(password, 10);
        //create new user
        const newStaff = 
            {
                name: username,
                username: username,
                password: hashedPwd,
                role: role
            }

        //write to db
        Staff.createStaff(newStaff, (err, data)=>{
            if(err) {
                console.log(err);
            }
        })

        res.status(201).json({ message: `New user ${username} created!` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loadUserRegisterPage = (req, res) =>{
    res.render('registerUser.ejs');
}

const loadStaffRegisterPage = (req, res) => {
    res.render('registerStaff.ejs');
}

module.exports = {
    handleNewUser,
    handleNewStaff,
    loadStaffRegisterPage,
    loadUserRegisterPage
};