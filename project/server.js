const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/formDB');


const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a schema for the form data
const formDataSchema = new mongoose.Schema({
    name: String,
    password: String
});

// Create a model using the schema
const FormData = mongoose.model('FormData', formDataSchema);

// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));


// Serve the page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/landingpg.html');
});

//serve the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { name, password } = req.body;

    // Create a new document with the submitted data
    const formData = new FormData({ name, password });

    // Save the document to the database
    formData.save()
        .then(() => {
            // res.send('Data saved successfully');
            res.sendFile(__dirname + '/views/index.html');

        })
        .catch((error) => {
            console.error(error);
            res.send('Error saving data');
        });
});


// will enter login code later

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


