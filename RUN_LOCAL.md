# Run Blockchain e-Voting on Your Local System

## Prerequisites

- **Node.js 18+** (you have this)
- **MongoDB** – either:
  - **Option A:** [MongoDB Community](https://www.mongodb.com/try/download/community) installed locally, or
  - **Option B:** MongoDB Atlas account with network access (e.g. IP whitelist, correct connection string)

## Quick start

### 1. Use local MongoDB (recommended if Atlas fails)

If the project’s Atlas URL doesn’t work (e.g. `ENOTFOUND`), use a local database.

Edit `backend/.env` and set:

```env
MONGO_URI=mongodb://localhost:27017/evoting
```

Then start MongoDB (if installed as a service it may already be running), or start it manually.

### 2. Install dependencies (already done)

```powershell
cd "blockchain_eVoting\backend"
npm install

cd "..\frontend"
npm install
```

### 3. Create sample data (optional, needs MongoDB running)

```powershell
cd backend
node scripts/createSampleData.js
```

This creates:
- **Admin:** `hvinprimary@gmail.com` / `123456`
- **Voter:** `voter@test.com` / `123456`
- A sample election

### 4. Start backend

```powershell
cd backend
npm run dev
```

Backend runs at **http://localhost:5002**. You should see “MongoDB connected” and “Server running on port 5002”.

### 5. Start frontend (new terminal)

```powershell
cd frontend
npm run dev
```

Frontend runs at **http://localhost:3000**.

### 6. Open the app

- **App:** http://localhost:3000  
- **API:** http://localhost:5002  

---

## If MongoDB Atlas is not connecting

- Check internet and DNS.
- In [MongoDB Atlas](https://cloud.mongodb.com): Database → Connect → check connection string and ensure your IP is allowed (or use “Allow access from anywhere” for testing).
- Or switch to local MongoDB as in step 1 above.

## Project paths on your machine

Use the full path to the real project (not `__MACOSX`):

```
...\Desktop\Blockchain E Voting\blockchain_eVoting\blockchain_eVoting\
├── backend\    ← run: npm run dev
├── frontend\   ← run: npm run dev
└── .env is in backend\
```
