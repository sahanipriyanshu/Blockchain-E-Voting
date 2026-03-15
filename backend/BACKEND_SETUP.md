# Backend Setup Guide (Borrowed Project)

Step-by-step setup for the Blockchain e-Voting backend on your machine.

---

## 1. Prerequisites

- **Node.js 18+** – [Download](https://nodejs.org/)
- **MongoDB** – either:
  - **Local:** [MongoDB Community](https://www.mongodb.com/try/download/community), or
  - **Cloud:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)

---

## 2. Install dependencies

From the project root, go into the backend folder and install:

**Windows (PowerShell):**
```powershell
cd backend
npm install
```

**macOS/Linux:**
```bash
cd backend
npm install
```

---

## 3. Environment variables (`.env`)

The backend reads config from a `.env` file in the `backend` folder.

### Option A: Copy from someone who gave you the project

If they shared a `.env` or `.env.example`, copy it to `backend/.env`:

```powershell
# From backend folder – if you have .env from the original author:
copy path\to\their\.env .env
```

### Option B: Create your own `.env`

Create a file named **`.env`** inside the **`backend`** folder with:

```env
# Required: MongoDB connection string
MONGO_URI=mongodb://localhost:27017/evoting

# Required: Secret for JWT tokens (use a long random string in production)
JWT_SECRET=your_secret_key_change_this_in_production

# Optional: Port (default is 5002)
PORT=5002

# Optional: For vote encryption (app has defaults if not set)
# ENCRYPTION_KEY=your_encryption_key
# SIGNATURE_KEY=your_signature_key
```

**MongoDB options:**

| Use case        | `MONGO_URI` value |
|-----------------|--------------------|
| MongoDB on your PC | `mongodb://localhost:27017/evoting` |
| MongoDB Atlas   | From Atlas: Connect → Drivers → copy connection string, then replace `<password>` with your DB user password and add database name, e.g. `.../evoting?retryWrites=true&w=majority` |

---

## 4. Create sample data (optional)

Creates an admin user and a sample election so you can log in and test:

```powershell
# From backend folder
node scripts/createSampleData.js
```

**Default accounts after running the script:**

| Role   | Email                   | Password |
|--------|-------------------------|----------|
| Admin  | hvinprimary@gmail.com   | 123456   |
| Voter  | voter@test.com          | 123456   |

---

## 5. Run the backend

**Development (with auto-restart on file changes):**
```powershell
npm run dev
```

**Production:**
```powershell
npm start
```

You should see:

- `MongoDB connected`
- `Server running on port 5002`

**Health check:** Open in browser or Postman:  
http://localhost:5002/api/health  
Response: `{"status":"ok"}`

---

## 6. Troubleshooting

| Problem | What to do |
|--------|-------------|
| `JWT_SECRET is not defined` | Add `JWT_SECRET=something_secret` to `backend/.env`. |
| `MongoDB connection error` / `ENOTFOUND` | Check `MONGO_URI` in `.env`. For Atlas: check internet, IP whitelist, and password in the connection string. For local: ensure MongoDB is installed and running. |
| `EADDRINUSE: port 5002` | Another app is using port 5002. Stop it or set `PORT=5003` (or another free port) in `.env`. |
| Scripts fail (e.g. `createSampleData.js`) | They use the same `MONGO_URI` from `.env`. Fix MongoDB connection first. |

---

## Summary

1. `cd backend` → `npm install`
2. Create `backend/.env` with `MONGO_URI` and `JWT_SECRET` (and optional `PORT`, keys).
3. (Optional) `node scripts/createSampleData.js`
4. `npm run dev` → backend at http://localhost:5002

Frontend expects the API at **http://localhost:5002** (or set `VITE_API_URL` in the frontend if you use a different port).
