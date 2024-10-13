const jwt = require('jsonwebtoken');
const UserModel = require('../models/User'); // Assurez-vous d'importer le modèle d'utilisateur

module.exports = async (req, res, next) => {
    console.log('Auth Middleware Triggered');
    console.log('############################');

    const token = req.headers['authorization']?.split(' ')[1];
    console.log('Authorization header:', req.headers['authorization']);
    console.log('############################');
    console.log('token => ', token);
    console.log('############################');

    if (!token) {
        console.log('Token is missing');
        return res.status(401).send({
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Proccess ENV JWT SECRET => ', process.env.JWT_SECRET);
        console.log('############################');
        console.log('decodedToken => ', decodedToken);
        console.log('############################');

        // Récupérer l'utilisateur à partir de l'ID du token
        const user = await UserModel.findById(decodedToken.userId);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }

        req.user = user; // Attacher l'utilisateur à la requête
        console.log('user => ', req.user);
        console.log('############################');

        next();
    } catch (error) {
        console.log('Token verification error => ', error.message);
        console.log('############################');

        return res.status(401).send({
            message: 'Access denied. Invalid token.',
            error: error.message
        });
    }
};
