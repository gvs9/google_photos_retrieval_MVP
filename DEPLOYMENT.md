# Google Photos Retrieval MVP: Deployment Plan

Because this MVP is built with **Next.js** and utilizes both an external LLM (Groq) and a local Machine Learning model (`@xenova/transformers`), you have two primary deployment paths. 

---

## Path A: Vercel (Recommended for Speed & Next.js native)
Vercel is the creator of Next.js and offers the absolute easiest deployment process, pulling directly from your GitHub repository.

### Pros & Cons
* **Pros:** Zero configuration, instant GitHub integration, auto-scaling, free tier is usually sufficient.
* **Cons:** Vercel uses "Serverless Functions" for API routes. The `@xenova/transformers` model (which is ~90MB) will need to be downloaded into the function's cache on a "cold start" (the very first time someone searches after the app has been asleep). This first search might take 5-10 seconds. Subsequent searches will be instant.

### Deployment Steps:
1. Go to [Vercel.com](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New Project** and import the `gvs9/google_photos_retrieval_MVP` repository.
3. In the **Configure Project** screen, leave the Build settings as default (Vercel auto-detects Next.js).
4. Open the **Environment Variables** dropdown and add:
   * **Key:** `GROQ_API_KEY`
   * **Value:** *(Paste your Groq API key here)*
5. Click **Deploy**. Vercel will build and host your site, providing you with a live `.vercel.app` URL.

---

## Path B: Render or Railway (Recommended for ML Stability)
If you want to avoid "Cold Starts" and ensure the ML model stays permanently loaded in memory, deploying it as a traditional Node.js server (rather than Serverless) is the better architectural choice.

### Pros & Cons
* **Pros:** The server stays alive, meaning the 90MB vector embedding model is always loaded in RAM. Searches are consistently lightning-fast.
* **Cons:** Slightly more setup; free tiers often spin down after 15 minutes of inactivity (though you can pay ~$5/mo to keep it awake 24/7).

### Deployment Steps (via Render):
1. Go to [Render.com](https://render.com) and link your GitHub.
2. Create a new **Web Service** and select your repository.
3. Configure the build:
   * **Environment:** `Node`
   * **Build Command:** `npm install && npm run build`
   * **Start Command:** `npm run start`
4. In the **Environment Variables** section, add `GROQ_API_KEY`.
5. Deploy.

---

## ⚠️ Pre-Deployment Checklist

Before deploying to either platform, verify the following:

1. **GitHub is up to date:** Ensure all local changes are pushed to `main`. *(Already done!)*
2. **API Keys are hidden:** Double-check that your `.env` and `.env.local` files are not pushed to GitHub. *(Already verified!)*
3. **Next.js Config:** We already added `serverExternalPackages: ['@xenova/transformers']` to `next.config.ts`, which prevents deployment build crashes associated with the ONNX ML runtime.

### Final Recommendation for MVP Testing:
Start with **Vercel**. It is completely free, takes exactly 2 minutes to set up, and seamlessly handles Next.js routing. If you notice the "cold start" delay on the very first search is too annoying for your stakeholders, you can easily migrate it to a paid Render instance later.
