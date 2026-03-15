# Code Walkthrough - Blockchain e-Voting System

## Project Structure

```
blockchain_eVoting/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
├── contracts/         # Solidity smart contracts
└── scripts/           # Deployment scripts
```

## Frontend Architecture

### Main Components

#### `App.jsx`
- Main application component
- Sets up routing and global providers (Auth, Theme)
- Configures toast notifications (Sonner)

#### `AuthContext.jsx`
- Manages user authentication state
- Handles login, register, logout
- Stores JWT token in localStorage
- Provides user data to all components

#### `ThemeContext.jsx`
- Manages dark mode (always enabled)
- Applies dark theme classes globally

#### Pages
- **Home.jsx**: Landing page with features and "How It Works"
- **Login.jsx**: User login (redirects if already logged in)
- **Register.jsx**: User registration (redirects if already logged in)
- **Dashboard.jsx**: User dashboard with stats and recent votes
- **Elections.jsx**: List of all elections
- **ElectionDetail.jsx**: View election and cast vote
- **Blockchain.jsx**: View blockchain data and mine blocks
- **AdminPanel.jsx**: Admin-only election creation
- **Results.jsx**: View election results and voting history

## Backend Architecture

### Main Entry Point

#### `server.js`
- Express server setup
- MongoDB connection
- Route registration
- CORS configuration
- Blockchain initialization

### Models

#### `User.js`
- Stores user information
- Hashes passwords with bcrypt
- Stores anonymous addresses per election
- Role-based access (voter/admin)

#### `Election.js`
- Election details
- Candidates list
- Start/end dates
- Status tracking

#### `Vote.js`
- Encrypted vote data
- Digital signature
- Transaction hash
- Links to election and user

### Routes

#### `auth.js`
- `/api/auth/register` - Create new user
- `/api/auth/login` - Authenticate user
- `/api/auth/me` - Get current user

#### `elections.js`
- `/api/elections` - Get all elections
- `/api/elections/:id` - Get single election
- `/api/elections` (POST) - Create election (admin only)

#### `votes.js`
- `/api/votes` (POST) - Cast a vote
- `/api/votes` (GET) - Get votes (filtered by user role)
- `/api/votes/:id` - Get single vote

#### `blockchain.js`
- `/api/blockchain` - Get blockchain data
- `/api/blockchain/mine` - Mine pending votes
- `/api/blockchain/verify` - Verify chain integrity

#### `smartContracts.js`
- `/api/smart-contracts/register-voter` - Register voter
- `/api/smart-contracts/tabulate` - Count votes
- `/api/smart-contracts/audit` - Audit election
- `/api/smart-contracts/verify-vote/:hash` - Verify vote

### Blockchain Implementation

#### `Blockchain.js`
- Core blockchain class
- Block creation and mining
- Chain validation
- Vote storage

#### `SmartContracts.js`
- JavaScript simulation of smart contracts
- VoterRegistrationContract
- BallotContract
- TabulationContract
- AuditContract

### Utilities

#### `encryption.js`
- `encryptBallot()` - Encrypts vote data (AES-256-GCM)
- `decryptBallot()` - Decrypts vote data
- `signVote()` - Creates digital signature (HMAC-SHA256)
- `verifySignature()` - Verifies signature
- `generateAnonymousAddress()` - Creates anonymous address
- `createVoteHash()` - Creates hash of vote

#### `initBlockchain.js`
- Initializes blockchain and smart contracts
- Manages switch between JavaScript and Solidity modes
- Provides getter functions for blockchain instances

#### `blockchainAdapter.js`
- Connects to Solidity contracts via ethers.js
- Provides same interface as JavaScript contracts
- Handles contract deployment addresses

## Voting Flow

### 1. User Registration
```
User → Register → Backend creates account → Anonymous address generated
```

### 2. Vote Casting
```
User selects candidate
  ↓
Vote encrypted (AES-256-GCM)
  ↓
Digital signature created (HMAC-SHA256)
  ↓
Vote hash generated
  ↓
Transaction hash created
  ↓
Smart contract verifies:
  - User is registered
  - User hasn't voted
  - Signature is valid
  ↓
Vote stored on blockchain
  ↓
Vote saved to MongoDB (off-chain)
```

### 3. Vote Counting
```
Tabulation contract counts votes
  ↓
Results published
  ↓
Audit contract verifies integrity
```

## Security Features

### 1. Encryption
- **Algorithm**: AES-256-GCM
- **Purpose**: Protects vote privacy
- **Location**: `backend/utils/encryption.js`

### 2. Digital Signatures
- **Algorithm**: HMAC-SHA256
- **Purpose**: Authenticates vote origin
- **Location**: `backend/utils/encryption.js`

### 3. Anonymous Addresses
- **Format**: `0x` + 40 hex characters
- **Purpose**: Decouples identity from vote
- **Storage**: User model, per election

### 4. Double Voting Prevention
- **Method**: Smart contract checks
- **Storage**: On-chain mapping
- **Location**: `BallotContract.js` / `BallotContract.sol`

### 5. Hybrid Storage
- **On-chain**: Encrypted data, hashes, signatures
- **Off-chain**: Real identity, sensitive data

## Solidity Contracts

### `EVotingSystem.sol`
- Main contract that deploys all other contracts
- Provides contract addresses

### `VoterRegistration.sol`
- Manages voter whitelist
- Prevents unauthorized voting

### `BallotContract.sol`
- Accepts encrypted votes
- Prevents double voting
- Stores vote data

### `TabulationContract.sol`
- Counts votes
- Publishes results

### `AuditContract.sol`
- Verifies election integrity
- Compares on-chain vs off-chain data

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Elections
- `GET /api/elections` - List elections
- `GET /api/elections/:id` - Get election
- `POST /api/elections` - Create election (admin)
- `PUT /api/elections/:id` - Update election (admin)
- `DELETE /api/elections/:id` - Delete election (admin)

### Votes
- `POST /api/votes` - Cast vote
- `GET /api/votes` - Get votes (filtered)
- `GET /api/votes/:id` - Get single vote

### Blockchain
- `GET /api/blockchain` - Get chain data
- `POST /api/blockchain/mine` - Mine block
- `GET /api/blockchain/verify` - Verify chain

### Smart Contracts
- `POST /api/smart-contracts/register-voter` - Register voter
- `POST /api/smart-contracts/tabulate` - Tabulate votes
- `POST /api/smart-contracts/audit` - Audit election
- `GET /api/smart-contracts/verify-vote/:hash` - Verify vote

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5002
ENCRYPTION_KEY=encryption-key
SIGNATURE_KEY=signature-key
```

### Frontend
- `VITE_API_URL` - Backend API URL (optional, uses proxy in dev)

## Deployment

### Solidity Contracts
1. Install Hardhat: `npm install --save-dev hardhat`
2. Compile: `npx hardhat compile`
3. Deploy: `npx hardhat run scripts/deploy.js`
4. Addresses saved to `backend/contract-addresses.json`

### Backend
1. Install dependencies: `npm install`
2. Set up `.env` file
3. Start server: `npm start` or `npm run dev`

### Frontend
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## Testing the System

### 1. Create Admin Account
- Email: `hvinprimary@gmail.com`
- Password: `123456`
- Run: `node backend/scripts/createSampleData.js`

### 2. Create Test Voter
- Email: `voter@test.com`
- Password: `123456`
- Run: `node backend/scripts/createTestVoter.js`

### 3. Test Voting Flow
1. Login as voter
2. Go to Elections
3. Select an election
4. Choose a candidate
5. Cast vote
6. Check Results page

## Key Files to Understand

1. **Backend Blockchain**: `backend/blockchain/Blockchain.js`
2. **Smart Contracts**: `backend/blockchain/SmartContracts.js`
3. **Encryption**: `backend/utils/encryption.js`
4. **Vote Route**: `backend/routes/votes.js`
5. **Frontend Auth**: `frontend/src/context/AuthContext.jsx`
6. **Voting Page**: `frontend/src/pages/ElectionDetail.jsx`

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check `.env` file
   - Verify MongoDB URI
   - Check network access

2. **401 Unauthorized**
   - Check JWT_SECRET in `.env`
   - Verify token in localStorage
   - Check user credentials

3. **Vote Casting Error**
   - Check blockchain initialization
   - Verify encryption keys
   - Check smart contract status

4. **Frontend Not Loading**
   - Clear Vite cache: `rm -rf node_modules/.vite`
   - Restart dev server
   - Check console for errors

## Next Steps

1. Read `BLOCKCHAIN_FOR_BEGINNERS.md` for conceptual understanding
2. Explore the code files mentioned above
3. Test the system with sample data
4. Deploy Solidity contracts for production use
