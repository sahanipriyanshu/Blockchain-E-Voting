import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { initBlockchain } from './utils/initBlockchain.js';

// Routes
import authRoutes from './routes/auth.js';
import electionRoutes from './routes/elections.js';
import voteRoutes from './routes/votes.js';
import blockchainRoutes from './routes/blockchain.js';
import smartContractRoutes from './routes/smartContracts.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Initialize blockchain
initBlockchain();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/smart-contracts', smartContractRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hvinprimary_db_user:1jOVcDjothOkPv2E@cluster0.qbtyp1o.mongodb.net/evoting?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

export default app;

