const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const accountRoutes = require('./routes/accountRoutes');
const connectDB = require('./config/database');

const app = express();
app.use(express.json({ extended: false }));

connectDB

app.use('/accounts', accountRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOSTNAME || "127.0.0.1"
app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});