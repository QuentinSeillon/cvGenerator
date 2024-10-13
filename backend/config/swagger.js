const swaggerJsDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation de l\'API pour la gestion des CVs',
        },
    },
    apis: ['./routes/*.js'], // Chemin vers vos fichiers de routes
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
