# Render Deployment Guide

This project can be easily deployed to [Render](https://render.com) using either the **Render Dashboard UI** or the **`render.yaml` Blueprint method**. 

## Option A: Using `render.yaml` (Recommended - 1 Click Setup)

1. Push the commit with `render.yaml` to your GitHub repository.
2. Go to the [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Blueprint**.
4. Connect the GitHub repository `blockchain_eVoting` (make sure Render has access to it).
5. Render will automatically detect the `render.yaml` file and prompt you to set up two services: `evoting-backend` and `evoting-frontend`.
6. **Required Action:** You will be prompted to enter a value for `MONGO_URI` in the backend service. Provide your MongoDB connection string (e.g. `mongodb+srv://...`).
7. Click **Apply**. Both your frontend and backend will build and deploy!
8. **Note for Frontend API URL:** Once the backend is deployed, copy its URL (e.g., `https://evoting-backend-xyz.onrender.com`). Go to the Frontend service settings on Render, navigate to **Environment**, and set `VITE_API_URL` to `https://evoting-backend-xyz.onrender.com/api`. Then, trigger a new manual deploy for the frontend.

---

## Option B: Deploying manually via Dashboard

If you prefer to configure it via the UI without the blueprint:

### 1. Deploy the Backend (Web Service)
1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name:** `evoting-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `PORT`: `5002` (Optional, Render assigns one automatically, but good to match your server).
5. Click **Create Web Service**. Wait for deployment to finish and copy the generated URL.

### 2. Deploy the Frontend (Static Site or Web Service)
1. Click **New +** > **Static Site**.
2. Connect your GitHub repository.
3. Configure the service:
   - **Name:** `evoting-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist` (Vite's default output folder)
4. Add Environment Variables:
   - `VITE_API_URL`: `<YOUR_BACKEND_URL_FROM_STEP_1>/api` (e.g., `https://evoting-backend-xyz.onrender.com/api`).
5. Click **Create Static Site**.

### Redirect Rules (For Frontend Static Site)
Since this is a React app using React Router, you need to add a redirect rule so page refreshes don't return a 404 error:
1. Go to your frontend service in the Render dashboard.
2. Click on the **Redirects/Rewrites** tab on the left.
3. Add a new rule:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
4. Save the rule.

---

**That's it! Your full stack app will be live.**
