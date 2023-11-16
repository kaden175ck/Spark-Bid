// console.log("Hello, world!");

// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();

// Import itemRoutes
const itemRoutes = require('./itemRoutes');

const PORT = process.env.PORT || 3001;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

app.use(cors());
app.use(bodyParser.json());

console.log('Starting server...');

app.get('/', (req, res) => {
  res.send('Server is running!');
});

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('Missing required fields');
  }

  try {
    const { user, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;

    // Do not insert user details into the `users` table here.
    // Wait for email confirmation first.

    res.status(201).send({ message: "Check your email to confirm your account", user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send({ message: error.message });
  }
}

app.post('/register', registerUser);

async function confirmUser(req, res) {
  const { token } = req.body;
  if (!token) {
    return res.status(400).send('Token is required');
  }

  try {
    const { user, error: confirmError } = await supabase.auth.api.getUser(token);
    if (confirmError) throw confirmError;

    const username = user.user_metadata.username;
    const email = user.email;

    const { data, error: insertError } = await supabase.from('users').insert([{ id: user.id, username, email }]);
    if (insertError) throw insertError;

    res.status(200).send("User confirmed successfully.");
  } catch (error) {
    console.error('Confirmation error:', error);
    res.status(500).send({ message: error.message });
  }
}

app.post('/confirm', confirmUser);

async function loginUser(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const { user, session, error } = await supabase.auth.signIn({ email, password });
    if (error) throw error;

    if (!user) {
      return res.status(404).send('User not found or not confirmed');
    }

    res.status(200).send({ session });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).send({ message: error.message });
  }
}

app.post('/login', loginUser);

async function fetchUsers(req, res) {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error) throw error;

    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send({ message: error.message });
  }
}

app.get('/users', fetchUsers);


// Use itemRoutes for all item related endpoints
app.use('/api/items', itemRoutes);


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
