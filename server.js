import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Routes
import authRoutes from './routes/auth.js';
import oilRoutes from './routes/oil.js';
import galleryRoutes from './routes/gallery.js';
import requireAuth from './middleware/requireAuth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Required for Cloud Run / Nginx proxy
  cookie: { 
    secure: true,      // Required for SameSite=None
    sameSite: 'none',  // Required for cross-origin iframe
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Route Handlers
app.use('/auth', authRoutes);
app.use('/oil', oilRoutes);
app.use('/gallery', galleryRoutes);

// View Routes
app.get('/', (req, res) => res.redirect('/oil'));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/login.html'));
});

app.get('/oil', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/oil.html'));
});

app.get('/gallery', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views/gallery.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT} (No-DB Mode)`);
});
