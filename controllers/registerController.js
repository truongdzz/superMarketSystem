const User = require('../models/userModel');
const Staff = require('../models/staffModel');

const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, username, phone, password } = req.body;
    // check username and password
    if (!username || !password) {
        //return res.status(400).json({ message: 'Username and password are required!' });
        return res.status(400).render('registerUser',{
            message: 'Username and password are required!'
        })
    }

    try {
            
        //check for duplicate username in db
        const userlist = await User.pullData();
        const isDuplicate = userlist.find(person => person.username === username);
        if (isDuplicate) {
            //return res.status(409).json({ message: 'Username or phone number already exist!' });
            return res.status(409).render('registerUser',{
                message: 'Username already exist!'
            })
        }
        const isDuplicate1 = userlist.find(person => person.phone === phone);
        if(isDuplicate1){
            //return res.status(409).json({ message: 'User name or phone number already exist!' });   
            return res.status(409).render('registerUser',{
                message: 'Phone number already exist!'
            })
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
        const data = await User.createUser(newUser);
        if (req.query.xml) {
            res.status(201).json(
                { 
                    message: `New user ${username} created`,
                    insertedId: data.insertId 
                }
            );
        } else{
            res.status(201).render('userLogin',{
                message: `New user ${username} created!`
            })
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const handleNewStaff = async (req, res) => {
    const { name, phone, username, password, role } = req.body;
    if (!username || !password || !role || !name || !phone) {
        //return res.status(400).json({ message: 'Username and password and role are required.' });
        return res.status(400).render('registerStaff',{
            message: 'Username and password, phone and role are required.'
        })
    }
    
    try {
        //check duplicate staff
        const staffname = await Staff.pullData();
        const isDuplicatePhone = staffname.find(staff => staff.phone === phone);
        if(isDuplicatePhone) return res.status(400).render('registerStaff',{
            message: "Phone number already exist."
        })

        const isDuplicate = staffname.find(staff => staff.username === username);
        if(isDuplicate) 
            //return res.status(409).json({message: `Username ${username} already exist.`});
            return res.status(400).render('registerStaff',{
                message: "Username already exist."
            })

        //hash the password
        const hashedPwd = await bcrypt.hash(password, 10);
        //create new user
        const newStaff = 
            {
                name: name,
                phone: phone,
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

        //res.redirect('/login/staff?message=registerSuccessful');
        res.status(201).render('staffLogin',{
            message: "New staff created!"
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loadUserRegisterPage = (req, res) =>{
    res.render('registerUser.ejs',{
        message: ""
    });
}

const loadStaffRegisterPage = (req, res) => {
    res.render('registerStaff.ejs',{
        message: ""
    });
}

module.exports = {
    handleNewUser,
    handleNewStaff,
    loadStaffRegisterPage,
    loadUserRegisterPage
};