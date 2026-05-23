const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

// ── helpers ────────────────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function ok(res, message, data = null) {
  return res.status(200).json({ status: 0, message, data });
}

function badRequest(res, message) {
  return res.status(400).json({ status: 102, message, data: null });
}

// ── controllers ────────────────────────────────────────────────────────────

async function register(req, res, next) {
  try {
    const { email, first_name, last_name, password } = req.body;

    if (!email || !isValidEmail(email)) {
      return badRequest(res, 'Paramter email tidak sesuai format');
    }
    if (!password || password.length < 8) {
      return badRequest(res, 'Password minimal 8 karakter');
    }
    if (!first_name || !last_name) {
      return badRequest(res, 'First name dan last name wajib diisi');
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return badRequest(res, 'Email sudah terdaftar');
    }

    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4)',
      [email, first_name, last_name, hashed]
    );

    return ok(res, 'Registrasi berhasil silahkan login');
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !isValidEmail(email)) {
      return badRequest(res, 'Paramter email tidak sesuai format');
    }
    if (!password || password.length < 8) {
      return badRequest(res, 'Password minimal 8 karakter');
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '12h',
    });

    return ok(res, 'Login Sukses', { token });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT email, first_name, last_name, profile_image FROM users WHERE email = $1',
      [req.user.email]
    );
    const user = result.rows[0];
    return ok(res, 'Sukses', user);
  } catch (err) {
    next(err);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { first_name, last_name } = req.body;

    if (!first_name || !last_name) {
      return badRequest(res, 'First name dan last name wajib diisi');
    }

    const result = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, updated_at = NOW()
       WHERE email = $3
       RETURNING email, first_name, last_name, profile_image`,
      [first_name, last_name, req.user.email]
    );

    return ok(res, 'Update Pofile berhasil', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateProfileImage(req, res, next) {
  try {
    if (!req.file) {
      return badRequest(res, 'Format Image tidak sesuai');
    }

    const imageUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;

    const result = await pool.query(
      `UPDATE users SET profile_image = $1, updated_at = NOW()
       WHERE email = $2
       RETURNING email, first_name, last_name, profile_image`,
      [imageUrl, req.user.email]
    );

    return ok(res, 'Update Profile Image berhasil', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getProfile, updateProfile, updateProfileImage };
