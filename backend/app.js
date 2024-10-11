require('dotenv').config();
const express = require('express');
const app = express();
const apiRouter = require('./routes');
const connectDb = require('./config/db');

connectDb();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/', apiRouter);

app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
