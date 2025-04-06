import app from './app';
import { testConnection } from './config/database';

const port = process.env.PORT;

async function startServer() {
  try {
    app.listen(port, async () => {
      console.log(`✅ Server running at http://127.0.0.1:${port}`);
      await testConnection();
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
