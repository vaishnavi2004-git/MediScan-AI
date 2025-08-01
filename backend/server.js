const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const CryptoJS = require('crypto-js');
const winston = require('winston');
require('dotenv').config();

const app = express();
// Restrict CORS to localhost only (customize for prod)
app.use(cors({ origin: [/^http:\/\/localhost(:\d+)?$/], credentials: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const ENC_SECRET = process.env.ENC_SECRET || 'datasecurekey';
const USERS_FILE = path.join(__dirname, 'users.json');

// Winston audit logger
const auditLogger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, 'audit.log') })
  ]
});

// Rate limiters
// Development rate limiting (allow more requests for testing)
const authLimiter = rateLimit({ 
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 100, // Allow 100 requests per minute
  message: 'Too many attempts. Please wait a minute before trying again.'
});
const analyzeLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 5, message: 'Too many AI requests, try again.' });


function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return { users: [], reports: [] };
  return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
}
function writeUsers(data) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
}
// AES-256 encryption helpers
function encryptField(text) {
  return CryptoJS.AES.encrypt(text, ENC_SECRET).toString();
}
function decryptField(cipher) {
  try {
    return CryptoJS.AES.decrypt(cipher, ENC_SECRET).toString(CryptoJS.enc.Utf8);
  } catch {
    return cipher;
  }
}

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Register endpoint
app.post('/register', authLimiter, [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { email, password } = req.body;
  const data = readUsers();
  if (data.users.find(u => u.email === email)) return res.status(409).json({ error: 'User exists' });
  const hash = await bcrypt.hash(password, 10);
  const id = Date.now().toString();
  // MFA placeholder for future
  data.users.push({ id, email, password: hash, mfa: false });
  writeUsers(data);
  auditLogger.info(`User registered: ${email} (${id})`);
  const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Login endpoint
app.post('/login', authLimiter, [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { email, password } = req.body;
  const data = readUsers();
  const user = data.users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  auditLogger.info(`User login: ${email} (${user.id})`);
  const token = jwt.sign({ id: user.id, email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// Save report endpoint
app.post('/reports', authMiddleware, [
  body('summary').isString(),
  body('insights').isArray(),
  body('glossary').isArray(),
  body('raw').isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { summary, insights, glossary, raw } = req.body;
  const data = readUsers();
  const report = {
    id: Date.now().toString(),
    userId: req.user.id,
    summary: encryptField(summary),
    insights: encryptField(JSON.stringify(insights)),
    glossary: encryptField(JSON.stringify(glossary)),
    raw: encryptField(raw),
    createdAt: new Date().toISOString()
  };
  data.reports.push(report);
  writeUsers(data);
  auditLogger.info(`Report created by user ${req.user.id}: ${report.id}`);
  res.json({ success: true, report: { ...report, summary, insights, glossary, raw } });
});

// Get all reports for current user
app.get('/reports', authMiddleware, (req, res) => {
  const data = readUsers();
  const reports = data.reports
    .filter(r => r.userId === req.user.id)
    .map(r => ({
      ...r,
      summary: decryptField(r.summary),
      insights: JSON.parse(decryptField(r.insights)),
      glossary: JSON.parse(decryptField(r.glossary)),
      raw: decryptField(r.raw)
    }));
  auditLogger.info(`Reports accessed by user ${req.user.id}`);
  res.json({ reports });
});

// Get a single report by ID
app.get('/reports/:id', authMiddleware, (req, res) => {
  const data = readUsers();
  const report = data.reports.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!report) return res.status(404).json({ error: 'Not found' });
  auditLogger.info(`Report ${req.params.id} accessed by user ${req.user.id}`);
  res.json({
    report: {
      ...report,
      summary: decryptField(report.summary),
      insights: JSON.parse(decryptField(report.insights)),
      glossary: JSON.parse(decryptField(report.glossary)),
      raw: decryptField(report.raw)
    }
  });
});

// Delete a report by ID
app.delete('/reports/:id', authMiddleware, (req, res) => {
  const data = readUsers();
  const idx = data.reports.findIndex(r => r.id === req.params.id && r.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  auditLogger.info(`Report ${req.params.id} deleted by user ${req.user.id}`);
  data.reports.splice(idx, 1);
  writeUsers(data);
  res.json({ success: true });
});

// Delete user account and all their reports
app.delete('/user', authMiddleware, (req, res) => {
  const data = readUsers();
  const userIdx = data.users.findIndex(u => u.id === req.user.id);
  if (userIdx === -1) return res.status(404).json({ error: 'User not found' });
  auditLogger.info(`User ${req.user.id} deleted their account.`);
  data.users.splice(userIdx, 1);
  data.reports = data.reports.filter(r => r.userId !== req.user.id);
  writeUsers(data);
  res.json({ success: true });
});

// Friendly message for GET /
app.get('/', (req, res) => {
  res.send('Gemini AI backend is running. Use POST /analyze for AI analysis.');
});

app.post('/analyze', analyzeLimiter, [
  body('text').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { text } = req.body;
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: `You are an AI medical report analyzer.  
After your summary and recommendations, always output a section titled "Visual Summary" in this format:

Visual Summary:
MetricName: value [unit] (status, Normal: normal-range)
...

For example:
Hemoglobin: 12.3 g/dL (Low, Normal: 13.5-17.5)
Lymphocytes: 52% (High, Normal: 20-40)
Platelets: 200 x10^9/L (Normal, Normal: 150-400)

Only include metrics that are present in the report. If a normal range is not available, omit it.\n\n${text}`
              }
            ]
          }
        ]
      }
    );
    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ask Me Out: Answer user questions via Gemini
app.post('/ask', analyzeLimiter, [
  body('question').isString().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { question } = req.body;
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [
          {
            parts: [
              {
                text: `You are a helpful, friendly, and medically knowledgeable AI assistant. Answer the following user health or medical question in clear, understandable language. If the question is outside your scope, say so politely.\n\nQuestion: ${question}`
              }
            ]
          }
        ]
      }
    );
    const answer = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Security: Dependency checks (run regularly):
// Add to package.json: "scripts": { "audit": "npm audit" }
// Security: MFA and DB access controls (future):
// - Add MFA logic to user object and endpoints
// - Restrict DB/file access to only app/service user
// Security: File upload scanning (future):
// - Use npm packages like 'multer' and 'file-type' to validate uploads

// Start server
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});