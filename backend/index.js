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
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

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

  // Check if all required fields are provided
  if (!username || !email || !password) {
    return res.status(400).send('Please provide username, email, and password');
  }

  try {
    // Attempt to create a new user in Supabase
    let { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    // Log the response from Supabase signUp method
    console.log('Supabase signUp response:', { user, signUpError });

    // Handle any errors from the signUp process
    if (signUpError) {
      console.error('Sign up error:', signUpError);
      throw signUpError;
    }

    // Check if the user object is valid
    if (!user) {
      throw new Error("User was not created.");
    }

    // Insert additional user details into your users table
    const { data: userData, error: insertError } = await supabase
      .from('users')
      .insert([{ id: user.id, username, email }]);

    // Log the response from inserting user into your database
    console.log('User data insertion response:', { userData, insertError });

    // Handle any errors from the data insertion process
    if (insertError) {
      console.error('User data insertion error:', insertError);
      throw insertError;
    }

    // Send successful response back
    res.status(201).send({ user: userData });

  } catch (error) {
    // Log and send back any errors encountered during the registration process
    console.error('Registration error:', error);
    res.status(500).send({ message: error.message, details: error.details });
  }
});




// User Login Endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password');
  }

  try {
    let { user, session, error } = await supabase.auth.signIn({
      email,
      password
    });

    if (error) throw error;

    if (!user) throw new Error('User does not exist.');

    res.status(200).send({ message: 'Login successful', session });
  } catch (error) {
    console.error(error);
    res.status(401).send({ message: error.message });
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