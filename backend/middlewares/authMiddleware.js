const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log('Auth Middleware Triggered');

    const token = req.headers['authorization']?.split(' ')[1];

    console.log('Authorization header:', req.headers['authorization']);
    console.log('token => ', token);

    if (!token) {
        return res.status(401).send({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Proccess ENV JWT SECRET => ', process.env.JWT_SECRET);
        
        console.log('decodedToken => ', decodedToken);

        req.userId = decodedToken.userId;

        console.log('userId => ', req.userId);

        next();
    } catch (error) {
        console.log('Token verification error => ', error.message);

        return res.status(401).send({
            message: 'Access denied. Invalid token.',
            error: error.message
        });
    }
};
