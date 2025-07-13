# Pagify - AI-Powered PDF Summarizer & Query Tool

![Pagify Preview](./images/pagify.webp)

**Pagify** is a web application that allows users to upload PDF documents, generate AI-powered summaries, ask questions about the content, and listen to responses in Indian English using text-to-speech (TTS). Built by Aakarsh Tiwari with a vanilla JavaScript frontend (no React) and a Node.js backend, Pagify offers a seamless and accessible way to interact with PDFs. Deployed on Vercel (frontend: [https://pagify.aakarshtiwari.com](https://pagify.aakarshtiwari.com)) and Render (backend: [https://aipdfreader-0f7m.onrender.com](https://aipdfreader-0f7m.onrender.com)), it uses OpenAI’s GPT-3.5-turbo for intelligent processing.

Try it at [Pagify](https://pagify.aakarshtiwari.com).

> "Education is the manifestation of the perfection already in man." — Swami Vivekananda

## Features

- **PDF Upload**: Upload PDFs (up to 5MB, 10 pages) for processing.
- **AI Summarization**: Generate concise summaries of PDF content using OpenAI’s GPT-3.5-turbo.
- **Question Answering**: Ask questions about the PDF and get precise, AI-generated answers.
- **Text-to-Speech**: Listen to summaries and answers in Indian English (`en-IN`) using the Web Speech API.
- **Responsive Design**: Mobile-friendly UI with a clean, modern interface using Poppins font and a teal palette.
- **Accessibility**: ARIA labels and alt text for improved screen reader support.
- **SEO Optimized**: Meta tags, structured data (JSON-LD), and canonical URLs for better search engine visibility.

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla), Font Awesome, Google Fonts (Poppins)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **AI**: OpenAI GPT-3.5-turbo for summarization and Q&A
- **TTS**: Web Speech API for Indian English voice output
- **File Handling**: Multer for PDF uploads, pdf-parse for text extraction
- **Deployment**:
  - Frontend: Vercel
  - Backend: Render
- **Other**: CORS, dotenv for environment variables
- **Performance**: Pre-warming with `/health` and `/ping` endpoints to minimize Render cold starts

## Prerequisites

To run Pagify locally, ensure you have:

- Node.js (v18 or higher)
- MongoDB Atlas account
- An OpenAI API key (sign up at [OpenAI](https://platform.openai.com))
- Git
- A modern browser (Chrome recommended for `en-IN` TTS support)

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/aakarshtiwari26/aipdfreader-frontend.git
   cd aipdfreader-frontend
   ```

2. **Backend Setup**:

   - Clone the backend repo (assumed separate, e.g., `aakarshtiwari26/pagify-backend`):
     ```bash
     git clone https://github.com/aakarshtiwari26/aipdfreader-backend.git
     cd pagify-backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory:
     ```text
     MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.efuj1.mongodb.net/adobe?retryWrites=true&w=majority
     OPENAI_API_KEY=sk-proj-<your-key>
     FRONTEND_URL=https://pagify.aakarshtiwari.com
     ```
     - Replace `<user>`, `<password>`, `<dbname>` and `<your-key>` with your MongoDB Atlas credentials and OpenAI API key.
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup**:

   - Return to the frontend directory:
     ```bash
     cd ../aipdfreader-frontend
     ```
   - Move files to `public/`:
     ```bash
     mkdir -p public/images
     mv index.html robots.txt sitemap.xml vercel.json public/
     mv images/* public/images/
     ```
   - Serve the frontend using a static server (e.g., `live-server`):
     ```bash
     npm install -g live-server
     live-server public
     ```
   - Alternatively, deploy to Vercel (see Deployment section).

4. **Verify**:
   - Backend: `http://localhost:10000/health` should return:
     ```json
     { "status": "healthy" }
     ```
   - Frontend: Open `http://localhost:8080` (or port shown by `live-server`) to access Pagify.

## Usage

1. **Upload a PDF**:

   - Drag and drop a PDF file (<5MB, ≤10 pages) or click to browse.
   - Pagify processes the PDF and displays a summary.

2. **View Summary**:

   - The AI-generated summary appears in the "Summary" section.
   - Click the speaker icon to hear the summary in Indian English.

3. **Ask Questions**:

   - Enter a question about the PDF content in the "Ask a Question" section.
   - Submit to get an AI-generated answer.
   - Click the speaker icon to hear the answer.

4. **Text-to-Speech**:
   - Toggle the speaker button to play or pause the audio.
   - Best experienced in Chrome for Indian English (`en-IN`) voice support.

## Deployment

- **Frontend (Vercel)**:

  1. Push the frontend code to a GitHub repository (`aakarshtiwari26/aipdfreader-frontend`).
  2. Connect the repo to Vercel via the Vercel dashboard.
  3. Configure `vercel.json` to proxy `/api/*` requests and serve static files correctly:
     ```json
     {
       "version": 2,
       "builds": [
         {
           "src": "public/**",
           "use": "@vercel/static"
         }
       ],
       "routes": [
         {
           "src": "/api/(.*)",
           "dest": "https://aipdfreader-0f7m.onrender.com/api/$1"
         },
         {
           "src": "/sitemap.xml",
           "dest": "/public/sitemap.xml",
           "headers": {
             "Content-Type": "application/xml"
           }
         },
         {
           "src": "/robots.txt",
           "dest": "/public/robots.txt",
           "headers": {
             "Content-Type": "text/plain"
           }
         },
         {
           "src": "/(.*)",
           "dest": "/public/index.html"
         }
       ]
     }
     ```
  4. Deploy to get a URL like `https://pagify.aakarshtiwari.com`.
  5. Set domain in Vercel Dashboard: `pagify.aakarshtiwari.com` (CNAME: `cname.vercel-dns.com`).

- **Backend (Render)**:

  1. Push the backend code to a GitHub repository (`aakarshtiwari26/pagify-backend`).
  2. Create a new Web Service on Render, linking to the repo.
  3. Set environment variables in Render’s dashboard:
     ```text
     PORT=10000
     MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.efuj1.mongodb.net/<dbname>?retryWrites=true&w=majority
     OPENAI_API_KEY=sk-proj-<your-key>
     FRONTEND_URL=https://pagify.aakarshtiwari.com
     ```
  4. Deploy to get a public URL: `https://aipdfreader-0f7m.onrender.com`.

- **SEO**:
  - Submit `https://pagify.aakarshtiwari.com/sitemap.xml` to Google Search Console.
  - Ensure `robots.txt` allows crawling:
    ```text
    User-agent: *
    Allow: /
    Sitemap: https://pagify.aakarshtiwari.com/sitemap.xml
    ```

## Performance Optimization

To ensure fast backend responses and minimize Render’s cold start delays (~5-10s):

- **Internal Pre-Warming**:

  - The backend (`server.js`) includes a `/health` endpoint that returns:
    ```json
    { "status": "healthy" }
    ```
  - A `setInterval` function pings `/health` every 5 minutes to keep the Render instance warm.
  - Update `server.js` to ping `https://aipdfreader-0f7m.onrender.com/health` instead of `http://localhost`:
    ```javascript
    const preWarm = async () => {
      try {
        const response = await fetch(
          "https://aipdfreader-0f7m.onrender.com/health"
        );
        if (response.ok) {
          console.log("Pre-warm: Health check successful");
        } else {
          console.error("Pre-warm: Health check failed", response.status);
        }
      } catch (error) {
        console.error("Pre-warm error:", error.message);
      }
    };
    ```

- **External Pre-Warming**:
  - Use **UptimeRobot** (free plan, [uptimerobot.com](https://uptimerobot.com)):
    - Create a monitor for `https://aipdfreader-0f7m.onrender.com/ping` (or `/health`).
    - Set interval to 5 minutes.
    - Expect a 200 OK response (`pong` for `/ping` or `{ "status": "healthy" }` for `/health`).
  - Test response time:
    ```bash
    curl -w "%{time_total}s\n" https://aipdfreader-0f7m.onrender.com/ping
    ```
  - Reduces response time to <1s for `/api/upload` and `/api/ask` requests.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request with a clear description.

Please follow the Code of Conduct and ensure code adheres to ESLint rules (for backend) and Prettier formatting.

## License

MIT License © 2025 Aakarsh Tiwari

## Contact

- **Author**: Aakarsh Tiwari
- **LinkedIn**: [linkedin.com/in/aakarshtiwari](https://www.linkedin.com/in/aakarshtiwari/)
- **GitHub**: [github.com/aakarshtiwari26](https://github.com/aakarshtiwari26)
- **Twitter**: [@aakarshtiwari08](https://twitter.com/aakarshtiwari08)

For issues or feature requests, open a ticket on the [GitHub repository](https://github.com/aakarshtiwari26/aipdfreader-frontend).
