const mongoose = require('mongoose');

const CvSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    experiencesPeda: [
        {
            titre: {
                type: String,
                required: true // Titre de l'expérience pédagogique
            },
            description: {
                type: String,
                required: true // Description de l'expérience pédagogique
            }
        }
    ],
    experiencesPro: [
        {
            titre: {
                type: String,
                required: true // Titre de l'expérience pédagogique
            },
            description: {
                type: String,
                required: true // Description de l'expérience pédagogique
            }
        }
    ],
    recommandations: [
        {
            auteur: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            contenu: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isVisible: {
        type: Boolean,
        required: true
    }
});

const Cv = mongoose.model('Cv', CvSchema);

module.exports = Cv;
