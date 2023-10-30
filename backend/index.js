//console.log("Hello, world!");
// Load environment variables
require('dotenv').config();

// Importing dependencies
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Express and Middleware
const app = express();
app.use(express.json()); // for parsing application/json
const port = 3001;

// User Registration
app.post('/register', async (req, res) => {
  console.log('Attempting to register user...');
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    console.log('Error during registration:', error.message);
    return res.status(401).json({ error: error.message });
  }
  console.log('User registered:', user);
  return res.status(200).json({ user });
});


// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { user, error } = await supabase.auth.signIn({
    email,
    password,
  });
  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ user });
});

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
