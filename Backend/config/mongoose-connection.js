const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(`${process.env.DATABASE_URL}expense-management`)
    .then(() => {
        console.log("Database connected Successfully");

    })
    .catch((err) => {
        console.log(err);

    })

module.exports = mongoose.connection;