// lib/auth.js
'use strict';

const crypto = require('crypto');

const SALT = 'sehirde-simdi-static-salt-v1'; // MVP amaçlı; ileride kullanıcı bazlı salt + bcrypt önerilir.

function hashPassword(password) {
  return crypto.createHash('sha256').update(SALT + password).digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// Basit bellek-içi oturum deposu (tek sunucu örneği için yeterli, MVP amaçlı).
const sessions = new Map();

function createSession(username) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { username, created_at: Date.now() });
  return token;
}

function getSession(token) {
  return sessions.get(token);
}

function destroySession(token) {
  sessions.delete(token);
}

module.exports = { hashPassword, verifyPassword, createSession, getSession, destroySession };
