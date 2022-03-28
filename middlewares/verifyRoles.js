const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.userRole;
        if(!userRole) return res.status(401).json({message: 'Unauthorized'});
        const roleArray = [...allowedRoles];
        const foundRole = roleArray.includes(userRole);
        if(!foundRole) return res.status(401).json({message: 'Unauthorized'});
        next();
    }
}

module.exports = verifyRoles;