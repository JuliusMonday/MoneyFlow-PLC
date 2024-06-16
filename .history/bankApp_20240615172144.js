const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const accountRoutes = require('./routes/accountRoutes');

const app = express();
app.use(express.json({ extended: false }));

conn

app.use('/accounts', accountRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});