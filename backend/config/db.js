const db = require('mongoose');

function dbConnect() {
    db.connect(process.env.DATABASE_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.log('Database connection error', err));
}

module.exports = dbConnect;
