import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes';

// Load environment variables if needed
dotenv.config({ path: path.join(__dirname, '../config/.env') });

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy for secure cookies behind Render/Vercel
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3001', 
    'http://localhost:3000',
    'https://roma-film-production-opal.vercel.app'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50gb' }));
app.use(express.urlencoded({ limit: '50gb', extended: true }));
app.use(cookieParser());

// Mount API Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Roma Film Production API is running' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global Error Handler:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
