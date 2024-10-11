const express = require('express');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const cvRouter = require('./cvRoutes');
const authMiddleware = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/cv', authMiddleware, cvRouter);

module.exports = app;
