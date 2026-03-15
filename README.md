# Blockchain e-Voting System

A secure, transparent, and tamper-proof electronic voting system powered by blockchain technology.

## Features

- 🔐 **Secure Voting**: AES-256-GCM encryption for vote privacy
- ✍️ **Digital Signatures**: HMAC-SHA256 for vote authentication
- 🎭 **Anonymous Voting**: Cryptographic anonymity with anonymous addresses
- 📊 **Transparent Results**: Public blockchain ledger for verification
- 🛡️ **Double Voting Prevention**: Smart contract enforcement
- 🔍 **Audit Trail**: Complete election integrity verification
- 🎨 **Modern UI**: Beautiful glassmorphism design with dark mode

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Sonner (Toast notifications)
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- bcryptjs

### Blockchain
- Custom JavaScript Blockchain (Fallback)
- Solidity Smart Contracts (Production)
- Hardhat (Development)
- Ethers.js (Contract interaction)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blockchain_eVoting
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create `backend/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5002
   ENCRYPTION_KEY=your_encryption_key
   SIGNATURE_KEY=your_signature_key
   ```

5. **Create sample data**
   ```bash
   cd backend
   node scripts/createSampleData.js
   ```

6. **Start the backend**
   ```bash
   npm run dev
   ```

7. **Start the frontend** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5002

## Default Accounts

### Admin
- Email: `hvinprimary@gmail.com`
- Password: `123456`

### Test Voter
- Email: `voter@test.com`
- Password: `123456`

## Project Structure

```
blockchain_eVoting/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts (Auth, Theme)
│   │   ├── pages/         # Page components
│   │   └── config/        # Configuration files
│   └── package.json
├── backend/               # Node.js backend
│   ├── blockchain/        # Blockchain implementation
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Express server
├── contracts/             # Solidity smart contracts
├── scripts/               # Deployment scripts
└── hardhat.config.js      # Hardhat configuration
```

## Documentation

- [Blockchain for Beginners](BLOCKCHAIN_FOR_BEGINNERS.md) - Conceptual explanation
- [Code Walkthrough](CODE_WALKTHROUGH.md) - Technical implementation details

## Key Features Explained

### 1. Cryptographic Anonymity
- Each user gets an anonymous address per election
- Real identity is stored off-chain
- Votes are linked to anonymous addresses, not real identities

### 2. Encryption
- Votes are encrypted using AES-256-GCM
- Only authorized personnel can decrypt (for counting)
- Encryption keys are securely managed

### 3. Digital Signatures
- Each vote is digitally signed
- Prevents vote tampering
- Verifies vote authenticity

### 4. Smart Contracts
- **Voter Registration**: Manages voter whitelist
- **Ballot Contract**: Handles vote casting and prevents double voting
- **Tabulation Contract**: Counts votes automatically
- **Audit Contract**: Verifies election integrity

### 5. Hybrid Storage
- **On-chain**: Encrypted votes, hashes, signatures (public, verifiable)
- **Off-chain**: Real identities, sensitive data (private, secure)

## API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/:id` - Get single election
- `POST /api/elections` - Create election (admin only)

### Votes
- `POST /api/votes` - Cast a vote
- `GET /api/votes` - Get votes (filtered by role)
- `GET /api/votes/:id` - Get single vote

### Blockchain
- `GET /api/blockchain` - Get blockchain data
- `POST /api/blockchain/mine` - Mine pending votes
- `GET /api/blockchain/verify` - Verify chain integrity

## Solidity Deployment

### Prerequisites
- Hardhat installed
- Node.js 18+

### Deploy Contracts

1. **Compile contracts**
   ```bash
   npx hardhat compile
   ```

2. **Start Hardhat node** (in separate terminal)
   ```bash
   npx hardhat node
   ```

3. **Deploy contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network hardhat
   ```

4. **Contract addresses** are saved to `backend/contract-addresses.json`

## Security Considerations

- ⚠️ Change default JWT_SECRET in production
- ⚠️ Use strong encryption keys
- ⚠️ Secure MongoDB connection
- ⚠️ Implement rate limiting
- ⚠️ Add input validation
- ⚠️ Use HTTPS in production

## Development

### Backend
```bash
cd backend
npm run dev  # Uses node --watch for auto-reload
```

### Frontend
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ directory
```

### Backend
```bash
cd backend
npm start  # Uses node server.js
```

## License

This project is for educational and research purposes.

## Contributing

This is a research project. For questions or issues, please refer to the documentation files.



