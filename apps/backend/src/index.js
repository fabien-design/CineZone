import express from 'express';
import { Server } from 'socket.io'
import http from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import movieRoutes from './routes/movies.js';
import userRoutes from './routes/users.js';
import ratingRoutes from './routes/ratings.js';
import userListRoutes from './routes/userLists.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5000;

server.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

server.use(cookieParser());
server.use(express.json());

server.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

server.use('/api/movies', movieRoutes);
server.use('/api/users', userRoutes);
server.use('/api/ratings', ratingRoutes);
server.use('/api/lists', userListRoutes);

server.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Internal server error' });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
