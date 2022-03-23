const jwt = require('jsonwebtoken')
const JWT_SECRET = "Harshispro$heheboii" ;

const fetchUser = (req, res, next) => {
    // Get the user from the jwt token and id to request object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(err){
        return res.status(401).json({ error: 'Invalid token access denied' });
    }
}

module.exports = fetchUser