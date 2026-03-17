# Railway Deployment Guide

This project is configured to be easily deployed to [Railway](https://railway.app/). We have set up a `railway.json` configuration file so that Railway understands how to build and run the backend.

## 1. Deploying the Backend
The backend can be deployed easily with our configuration.

1. Push your code with `railway.json` to your GitHub repository.
2. Log in to [Railway](https://railway.app/).
3. Click **New Project** > **Deploy from GitHub repo**.
4. Select the `blockchain_eVoting` repository.
5. Railway will automatically detect the `railway.json` file in the root, which tells it to look in the `backend` folder and run `npm start`.
6. Once the service is created, go to the service settings on Railway, navigate to the **Variables** tab, and add your required environment variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `PORT`: You can leave this out, Railway assigns a port automatically.
7. Go to the **Settings** tab > **Networking** section, and click **Generate Domain** to get your public backend URL (e.g., `https://backend-production-abcd.up.railway.app`).

## 2. Deploying the Frontend
For React + Vite applications, **Netlify** or **Vercel** are generally better and faster, but you can also deploy the frontend on Railway as a Static Site.

1. On your Railway project dashboard, click **New** > **GitHub Repo**.
2. Select the *same* `blockchain_eVoting` repository again. This will add a second service to the project.
3. Before it builds, go to **Settings** of this new service.
4. Set the **Root Directory** to `/frontend`.
5. Set the **Build Command** to `npm run build` and **Start Command** to `npm run preview` or simply configure it as a static deployment if using a generic static buildpack.
6. In the **Variables** tab for the frontend, add:
   - `VITE_API_URL`: Your backend URL generated in Step 1 (e.g., `https://backend-production-abcd.up.railway.app/api`).
7. Once deployed, generate a domain in **Settings** > **Networking**. 

---
**Troubleshooting Check:**
- Make sure `MONGO_URI` in Railway connects successfully to MongoDB Atlas by keeping your Network Access in Atlas open (`0.0.0.0/0`) during deployment since Railway uses dynamic IPs.
- If using Netlify for the frontend instead (recommended), set `VITE_API_URL` to the new Railway backend URL in the Netlify dashboard Environment Variables settings!
