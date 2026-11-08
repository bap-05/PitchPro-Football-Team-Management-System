require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`[Server] PitchPro Backend running on http://localhost:${PORT}`);
    console.log(`[Server] Health check available at: http://localhost:${PORT}/api/v1/health`);
  });
};

startServer().catch((err) => {
  console.error('[Server] Failed to start server:', err);
  process.exit(1);
});

