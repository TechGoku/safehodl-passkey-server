const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.js');
const cors = require('cors');

require('dotenv').config()

var app = express();

app.use(cors({
    origin: '*', // or use '*' to allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // specify allowed methods if needed
}));

// Middleware
app.use(bodyParser.json());

// Connect with mongoDB
mongoose.connect( process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true    
}).then(()=>{
    console.log('connected to MongoDB')
}).catch((err)=>{
    console.log('MongoDB connection error:', err)
});


// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});