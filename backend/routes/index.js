const express = require('express');
const userRouter = require('./userRoutes');
const authRouter = require('./authRoutes');
const cvRouter = require('./cvRoutes');

const app = express();

app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/cv', cvRouter);

module.exports = app;
