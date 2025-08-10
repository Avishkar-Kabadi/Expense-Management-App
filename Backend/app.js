const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const db = require('./config/mongoose-connection');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions));

app.use('/auth', authRoutes);
app.use('/api/', expenseRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server is running at:http://localhost:${process.env.PORT}`);

})