require('dotenv').config({ path: './config/fs.env' });
const mongoose = require('mongoose');

const uri = process.env.DB_URI;
const express = require('express');
const User = require('./models/User');

const app = express();
app.use(express.json());


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });

  //GET: Return all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// POST: Add a new user to the database
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error adding user' });
  }
});

// PUT: Edit a user by ID
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error updating user' });
    }
  });
  
  // DELETE: Remove a user by ID
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndRemove(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error removing user' });
    }
  });
  
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
  