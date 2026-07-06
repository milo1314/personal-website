const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

const projectsRouter = require('./routes/projects');
const blogsRouter = require('./routes/blogs');
const skillsRouter = require('./routes/skills');
const quotesRouter = require('./routes/quotes');
const toolsRouter = require('./routes/tools');
const travelGuidesRouter = require('./routes/travelGuides');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/projects', projectsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/quotes', quotesRouter);
app.use('/api/tools', toolsRouter);
app.use('/api/travel-guides', travelGuidesRouter);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Personal Website API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const startServer = async () => {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📡 API health check: http://localhost:${PORT}/api/health`);
      console.log(`📁 Projects API: http://localhost:${PORT}/api/projects`);
      console.log(`📝 Blogs API: http://localhost:${PORT}/api/blogs`);
      console.log(`🎯 Skills API: http://localhost:${PORT}/api/skills`);
      console.log(`💬 Quotes API: http://localhost:${PORT}/api/quotes`);
      console.log(`🔧 Tools API: http://localhost:${PORT}/api/tools`);
      console.log(`✈️ Travel Guides API: http://localhost:${PORT}/api/travel-guides`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();