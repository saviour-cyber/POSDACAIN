# 🚀 CanonPOS Deployment Guide (Render)

This guide walks you through the 3-step process to get your POS live on Render.

## Prerequisites
1. Your code must be pushed to a **GitHub** repository.
2. You must have a **Render** account (linked to your GitHub).

---

## Step 1: Connect your Repository
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Select your repository.
4. Render will detect the `render.yaml` file I created. Click **Apply**.

## Step 2: Configure Environment Variables
During the setup (or in the "Environment" tab after), ensure the following are set:

1. **`DATABASE_URL`**: 
   - Paste your Neon Postgres connection string here.
2. **`NEXTAUTH_SECRET`**:
   - I have set Render to generate this for you automatically.
3. **`NEXTAUTH_URL`**:
   - Set this to your final rendered URL (e.g., `https://canonpos.onrender.com`).

## Step 3: Finalize DB Schema
Once the service is active, the database tables will be created automatically. 

> [!TIP]
> **Pro Tip**: I have configured the application to use the **Neon HTTP Adapter**. This means your deployment will be incredibly fast and won't consume database connection limits, which is perfect for scaling.

---

## Maintenance & Logs
- You can view real-time logs in the **Logs** tab of your Render dashboard.
- If you push new code to GitHub, Render will automatically rebuild and deploy the updates.
