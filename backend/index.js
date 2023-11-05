// console.log("Hello, world!");

// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Middlewares
app.use(cors());
app.use(bodyParser.json()); // Use bodyParser to parse JSON bodies



console.log('Starting server...');

// Test endpoint
app.get('/', (req, res) => {
  res.send('Auctioning System Backend is running!');
});



// User Registration Endpoint
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('Please provide username, email, and password');
  }

  try {
    let { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      if (signUpError.status === 429) {
        return res.status(429).send('Email rate limit exceeded. Please try again later.');
      }

      throw signUpError;
    } 
    
    if (!user) throw new Error("User was not created.");

    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert([{ id: user.id, username, email }]);

    if (insertError) throw insertError;

    res.status(201).send({ user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message, details: error.details });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Fetch Users Endpoint
app.get('/users', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    return res.status(500).send(error.message);
  }

  res.status(200).send(data);
});