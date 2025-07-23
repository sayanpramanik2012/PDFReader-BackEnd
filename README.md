# Docreader Backend

This is the Node.js backend for the Docreader application. It provides PDF processing and AI-powered document analysis via the Gemini API.

---

## Project Structure

```
PDFReader-BackEnd/      # Node.js backend
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

## Setup Instructions

### 1. Local Development (without Docker)

```bash
cd PDFReader-BackEnd
npm install
# Create a .env file and set GEMINI_API_KEY=your_api_key
node server.js
```

---

### 2. Dockerized Setup

1. Build the Docker image for the backend:

   ```bash
   cd PDFReader-BackEnd
   docker build -t backend .
   ```

2. Start the backend service using Docker Compose (from the Angular app directory):

   ```bash
   cd ../PDFReader-Angular
   docker-compose up -d
   ```

#### ⚠️ Important: API Token Configuration
- The backend requires a `GEMINI_API_KEY` environment variable. You can set it directly in `docker-compose.yml` or via a `.env` file in `PDFReader-BackEnd`.
- Never commit your real API keys to version control.

---

## Environment Variables

- `GEMINI_API_KEY` (required): Your Gemini/AI API key.
- For local dev, create a `.env` file in `PDFReader-BackEnd`:
  ```env
  GEMINI_API_KEY=your_api_key_here
  ```

---

## Scripts & Useful Commands

- `node server.js` — Start backend server

---

## Testing

- No test scripts defined by default. Add tests as needed.

---

## Additional Resources

- [Node.js Documentation](https://nodejs.org/en/docs)
- [Docker Compose Docs](https://docs.docker.com/compose/)

---

## Notes
- For production, ensure all secrets and API keys are managed securely (e.g., with Docker secrets or environment managers).
- For any issues, consult the respective documentation or raise an issue in this repository.
