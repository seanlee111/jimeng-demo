# Jimeng API Integration Demo

This project demonstrates how to integrate Volcano Engine's Jimeng (Dreamina) API into a Vercel-deployed React application.

## Prerequisites

- Node.js installed
- A Volcano Engine (Volcengine) account with Access Key and Secret Key.
- A Vercel account.

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/seanlee111/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Variables:**

    Create a `.env` file in the root directory (for local development via Vercel CLI) or configure them in your Vercel Project Settings.

    ```env
    VOLC_ACCESS_KEY=your_access_key_here
    VOLC_SECRET_KEY=your_secret_key_here
    ```

    > **Note:** Do not commit your `.env` file to version control.

## Local Development

To run the API functions locally, you need the Vercel CLI.

```bash
npm i -g vercel
vercel dev
```

This will start the frontend (Vite) and the backend (Serverless Functions) on `http://localhost:3000`.

## Deployment

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the Environment Variables (`VOLC_ACCESS_KEY`, `VOLC_SECRET_KEY`) in the Vercel Dashboard.
4.  Deploy!

## Project Structure

- `api/generate.ts`: The Vercel Serverless Function that calls the Volcengine API.
- `src/App.tsx`: The React frontend.
- `.trae/documents/`: Project documentation.
