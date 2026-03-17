# Railway Deployment Guide

This project is a monorepo containing both a `frontend` and a `backend` application. To deploy them successfully to [Railway](https://railway.app/), you must configure **two separate services** and set their **Root Directory** appropriately so Railway installs Node.js correctly.

## 1. Deploying the Backend

1. Push your code to your GitHub repository.
2. Log in to [Railway](https://railway.app/) and create a **New Project** > **Deploy from GitHub repo**.
3. Select the `blockchain_eVoting` repository.
4. **CRITICAL STEP**: Before the build finishes (or if it fails), go to the new service's **Settings** > **General** > **Root Directory** and type `/backend`.
5. Remove any custom "Build Command" or "Start Command" if you typed one in. Railway will automatically detect the `package.json` in the `/backend` folder and run `npm start`.
6. Go to the **Variables** tab and add your required environment variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `PORT`: (Optional) Railway assigns a port automatically.
7. Go to the **Settings** tab > **Networking** section, and click **Generate Domain** to get your public backend URL.

## 2. Deploying the Frontend

1. On your Railway project dashboard, click **New** > **GitHub Repo**.
2. Select the *same* `blockchain_eVoting` repository again. This adds a second service.
3. **CRITICAL STEP**: Go to this new service's **Settings** > **General** > **Root Directory** and type `/frontend`.
4. Remove any custom "Build Command" or "Start Command". Railway will now detect the Vite `package.json` in the `/frontend` folder, automatically run `npm run build`, and serve the static files or use `npm run preview`.
5. In the **Variables** tab, add:
   - `VITE_API_URL`: Your backend URL generated in Step 1 (e.g., `https://backend-production-abcd.up.railway.app/api`).
6. Once deployed, generate a domain in **Settings** > **Networking**.

---
**Fixing "npm: command not found" Errors:**
If you see the error `npm: command not found` or `"npm install" did not complete successfully: exit code: 127` in your deployment logs, it means Railway did not detect Node.js. This happens if you forgot to set the **Root Directory** to `/frontend` or `/backend`. Always set the Root Directory first so Railway knows where to find your `package.json`!
