const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.userRole;
        if(!userRole) return res.status(401).render('others/401.ejs');
        const roleArray = [...allowedRoles];
        const foundRole = roleArray.includes(userRole);
        if(!foundRole) return res.status(401).render('others/401.ejs');
        next();
    }
}

module.exports = verifyRoles;