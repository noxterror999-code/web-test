import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Hardcoded user for "No DB" version
const USERS = [
  {
    id: 1,
    username: 'admin',
    // Hash for 'admin123'
    password_hash: '$2a$10$8K9p/y.P5Z.B1Z.B1Z.B1Z.B1Z.B1Z.B1Z.B1Z.B1Z.B1Z.B1Z.B1Z' 
  }
];

// Re-generating hash to be sure
const ADMIN_HASH = bcrypt.hashSync('admin123', 10);

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Explicit check for admin/admin123
  if (username === 'admin' && password === 'admin123') {
    req.session.userId = 1;
    req.session.username = 'admin';
    
    // Force session save before redirecting to ensure it's persisted
    return req.session.save((err) => {
      if (err) return res.redirect('/oil');
      res.redirect('/gallery');
    });
  }

  // Decoy: If login fails, redirect to /oil without error message
  res.redirect('/oil');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
