const { Validator } = require('jsonschema');

module.exports = {
    verifyCv: (cv) => {
        if (!cv) {
            throw new Error('Cannot create new cv');
        }

        let validator = new Validator();
        let cvSchema = {
            type: 'object',
            properties: {
                nom: {
                    type: 'string',
                    minLength: 3,
                    errorMessage: 'Nom must be at least 3 characters long'
                },
                prenom: {
                    type: 'string',
                    minLength: 3,
                    errorMessage: 'Prenom must be at least 3 characters long'
                },
                description: {
                    type: 'string',
                    minLength: 15,
                    errorMessage: 'Desciption must be at least 15 characters long'
                },
                experiencesPeda: {
                    type: 'array',
                    errorMessage: 'You must have at least one experience pedagogique',
                    items: {
                        type: 'object',
                        properties: {
                            titre: {
                                type: 'string',
                                minLength: 3,
                                errorMessage: 'Titre must be at least 3 characters long'
                            },
                            description: {
                                type: 'string',
                                minLength: 10,
                                errorMessage: 'Description must be at least 10 characters long'
                            }
                        },
                        required: ['titre', 'description']
                    },
                    minItems: 1
                },
                experiencesPro: {
                    type: 'array',
                    errorMessage: 'You must have at least one experience professionnelle',
                    items: {
                        type: 'object',
                        properties: {
                            titre: {
                                type: 'string',
                                minLength: 3,
                                errorMessage: 'Titre must be at least 3 characters long'
                            },
                            description: {
                                type: 'string',
                                minLength: 10,
                                errorMessage: 'Description must be at least 10 characters long'
                            }
                        },
                        required: ['titre', 'description']
                    },
                    minItems: 1
                },
                recommandations: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            auteur: {
                                type: 'string',
                                pattern: "^[0-9a-fA-F]{24}$",  // Validation pour ObjectId de MongoDB
                                errorMessage: 'Auteur must be a valid ObjectId'
                            },
                            contenu: {
                                type: 'string',
                                minLength: 10,
                                errorMessage: 'Recommendation content must be at least 10 characters long'
                            }
                        },
                        required: ['auteur', 'contenu']
                    },
                    errorMessage: 'Recommandations must be valid'
                },
                isVisible: {
                    type: 'boolean',
                    errorMessage: 'Check if your Cv is visible or not'
                }
            },
            required: ['nom', 'prenom', 'description', 'experiencesPeda', 'experiencesPro', 'recommandations', 'isVisible']
        };

        let result = validator.validate(cv, cvSchema);

        if (result.errors.length) {
            const errorInputsMessage = result.errors
                .map((error) => {
                    return error.schema.errorMessage;
                })
                .join(' ');

            throw new Error(errorInputsMessage);
        }
    }
};
