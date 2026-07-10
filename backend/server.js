require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not set in environment variables.');
  process.exit(1);
}

const app = express();

// 1. MIDDLEWARES  
app.use(express.json());
app.use(cors());

// 2. DATABASE CONNECTION  
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/perscholas';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected successfully ✓'))
  .catch(err => console.error('MongoDB connection error:', err));

// 3. ROUTE DECLARATIONS  
// This links the specific routing files we coded earlier
const authRouter = require('./routes/auth');
const onboardingRouter = require('./routes/onboarding');
const roadmapRouter = require('./routes/roadmap');

// Mounting routers to specific clean URL endpoints
app.use('/api/auth', authRouter);               // Handles JWT auth (register/login)
app.use('/api/onboarding', onboardingRouter); // Handles Mistral AI Chatbot logic
app.use('/api/roadmap', roadmapRouter);       // Handles registration, merge engine & checkbox scoring

// 4. GLOBAL ERROR HANDLER 
app.use((err, req, res, next) => {
  console.error("Global Server Error Triggered :", err.stack);
  res.status(500).json({ error: "Something broken under the hood! Check backend console." });
});

// 5. SERVER LAUNCH 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`  Digital Gateway Backend  on port ${PORT}`);
});