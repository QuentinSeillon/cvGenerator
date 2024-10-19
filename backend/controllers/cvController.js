const { verifyCv } = require('./../validator/cvValidator');
const CvModel = require('../models/CV');

module.exports = {
    // Creer un CV
    createCv: async (req, res) => {
        try {
            console.log('CreateCV');

            console.log('requestbody', req.body);
            console.log('requestuser', req.user);

            const userId = req.user._id;

            console.log('userId Dans createCv => ', userId);

            verifyCv(req.body);
            const { nom, prenom, description, experiencesPeda, experiencesPro, isVisible } = req.body;

            const newCv = new CvModel({
                nom,
                prenom,
                description,
                experiencesPeda,
                experiencesPro,
                isVisible,
                user: userId
            });

            await newCv.save();
            res.status(201).send({
                id: newCv._id,
                nom: newCv.nom,
                prenom: newCv.prenom,
                description: newCv.description,
                experiencesPeda: newCv.experiencesPeda,
                experiencesPro: newCv.experiencesPro,
                isVisible: newCv.isVisible,
                user: newCv.user
            });
        } catch (error) {
            res.status(400).send({
                message: 'Error during creating new cv',
                error: error.message
            });
        }
    },
    // Afficher tous les CV de tous les utilisateurs
    allCv: async (req, res) => {
        try {
            const cv = await CvModel.find().populate('user'); // Assure-toi de peupler le champ user
            res.status(200).send(cv);
        } catch (error) {
            res.status(400).send({
                message: 'Error during getting all cv',
                error: error.message
            });
        }
    },
    // Afficher les cv de l'utilisateur via l'ID de l'utilisateur
    cvByUser: async (req, res) => {
        try {
            const cvs = await CvModel.find({ user: req.user._id }).populate('user');
            res.status(200).send(cvs);
        } catch (error) {
            res.status(400).send({
                message: 'Error during getting cv by user',
                error: error.message
            });
        }
    },
    // Mettre à jour un CV via son ID
    updateCv: async (req, res) => {
        try {
            const { nom, prenom, description, experiencesPeda, experiencesPro, isVisible } = req.body;
            const cv = await CvModel.findById(req.params.id);
            cv.nom = nom;
            cv.prenom = prenom;
            cv.description = description;
            cv.experiencesPeda = experiencesPeda;
            cv.experiencesPro = experiencesPro;
            cv.isVisible = isVisible;
            await cv.save();
            res.status(200).send({
                message: 'Cv updated successfully',
                cv
            });
        } catch (error) {
            res.status(400).send({
                message: 'Error during updating cv',
                error: error.message
            });
        }
    },
    // Supprimer un CV via son ID
    deleteCv: async (req, res) => {
        try {
            await CvModel.findByIdAndDelete(req.params.id);
            res.status(200).send({
                message: 'Cv deleted successfully'
            });
        } catch (error) {
            res.status(400).send({
                message: 'Error during deleting cv',
                error: error.message
            });
        }
    },
    // Afficher un CV via son ID
    getCvById: async (req, res) => {
        try {
            const userId = req.user.id;
            const cv = await CvModel.findById(req.params.id);

            if (!cv) {
                return res.status(404).send({ message: 'CV not found' });
            }

            if (cv.user.toString() !== userId) {
                return res.status(403).send({ message: 'Access denied: You do not own this CV' });
            }

            res.status(200).send(cv);
        } catch (error) {
            res.status(400).send({
                message: 'Error during getting CV',
                error: error.message
            });
        }
    },
    // Ajouter une recommandation à un CV
    recommendationCv: async (req, res) => {
        try {
            const { text } = req.body;

            // Vérification que le texte de la recommandation est présent
            if (!text) {
                return res.status(400).send({ message: 'Recommendation text is required' });
            }

            const cvId = req.params.id; // ID du CV
            const userId = req.user._id; // ID de l'utilisateur authentifié

            // Chercher le CV par son ID
            const cv = await CvModel.findById(cvId);

            // Vérifier si le CV existe
            if (!cv) {
                return res.status(404).send({ message: 'CV not found' });
            }

            // Vérifier si l'utilisateur n'essaie pas de recommander son propre CV
            if (cv.user.toString() === userId.toString()) {
                return res.status(403).send({ message: 'You cannot recommend your own CV' });
            }

            // Créer une nouvelle recommandation
            const newRecommendation = {
                auteur: userId,
                contenu: text,
                date: Date.now()
            };

            // Ajouter la recommandation au tableau des recommandations du CV
            cv.recommandations.push(newRecommendation);
            await cv.save();

            res.status(200).send({
                message: 'Recommendation added successfully',
                recommendations: cv.recommandations
            });
        } catch (error) {
            res.status(400).send({
                message: 'Error during adding recommendation',
                error: error.message
            });
        }
    }
};
