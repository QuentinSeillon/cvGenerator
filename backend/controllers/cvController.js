const { verifyCv } = require('./../validator/cvValidator');
const CvModel = require('../models/CV');

module.exports = {
    createCv: async (req, res) => {
        try {
            verifyCv(req.body);
            const { nom, prenom, description, experiencesPeda, experiencesPro, recommandations, isVisible } = req.body;

            const newCv = new CvModel({
                nom,
                prenom,
                description,
                experiencesPeda,
                experiencesPro,
                recommandations,
                isVisible
            });

            newCv.save();
            res.status(201).send({
                id: newCv._id,
                nom: newCv.nom,
                prenom: newCv.prenom,
                description: newCv.description,
                experiencesPeda: newCv.experiencesPeda,
                experiencesPro: newCv.experiencesPro,
                recommandations: newCv.recommandations,
                isVisible: newCv.isVisible
            });
        } catch (error) {
            res.status(401).send({
                message: 'Error during creating new cv',
                error: error.message
            });
        }
    }
};
