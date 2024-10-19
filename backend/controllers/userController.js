const { verifyUser } = require('./../validator/userValidator');
const UserModel = require('../models/User');
const bcrypt = require('bcrypt');

module.exports = {
    // Creer un nouvel utilisateur
    createUser: async (req, res) => {
        verifyUser(req.body);

        const { nom, prenom, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        if (await UserModel.findOne({ email })) {
            return res.status(400).send({
                error: 'Email already in use'
            });
        }

        const newUser = new UserModel({
            nom,
            prenom,
            email,
            password: hashedPassword
        });

        newUser.save();
        res.status(201).send({
            id: newUser._id,
            nom: newUser.lastname,
            prenom: newUser.firstname,
            email: newUser.email
        });
    }
};
