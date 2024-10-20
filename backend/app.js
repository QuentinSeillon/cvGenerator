require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const apiRouter = require('./routes');
const connectDb = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

connectDb();

const corsOptions = {
    origin: process.env.FRONTEND_URL, // Remplace par l'origine de ton frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'] // En-têtes autorisés
};

app.use(cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
  

// Routes pour la documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.use('/api/', apiRouter);

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
