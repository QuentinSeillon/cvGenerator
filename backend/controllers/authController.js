const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    // Authentification de l'utilisateur
    login: async (req, res) => {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(400).send({
                error: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const jwtOptions = {
                expiresIn: process.env.JWT_TIMEOUT_DURATION
            };

            const secret = process.env.JWT_SECRET;

            const token = jwt.sign(
                {
                    userId: user._id
                },
                secret,
                jwtOptions
            );

            res.status(200).send({
                message: 'Login successful',
                user: {
                    id: user.id,
                    prenom: user.prenom,
                    nom: user.nom,
                    token
                }
            });
        } else {
            res.status(401).send({
                error: 'Invalid password'
            });
        }
    }
};
