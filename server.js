const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const fs = require("fs");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" });

// It's recommended to store API keys securely,
// for demonstration, we'll get it from process.env
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Make sure to set this in your .env file

let pdfText = ""; // Global variable to store extracted PDF text

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

// Endpoint to handle PDF upload
app.post("/upload", upload.single("pdf"), async (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send({ error: "No PDF file uploaded" });
  }

  const filePath = req.file.path; // Path to the uploaded PDF file
  try {
    // Read the PDF file into a buffer
    const dataBuffer = fs.readFileSync(filePath);
    // Parse the PDF buffer to extract text
    const data = await pdfParse(dataBuffer);
    pdfText = data.text; // Store the extracted text
    fs.unlinkSync(filePath); // Delete the temporary uploaded file after parsing

    res.status(200).send({ message: "PDF uploaded and processed successfully" });
  } catch (error) {
    console.error("PDF parsing error:", error);
    res.status(500).send({ error: "Failed to process PDF" });
  }
});

// Endpoint to answer user questions using Gemini API
app.post("/ask", async (req, res) => {
  const { question } = req.body; // Get the question from the request body

  // Validate input
  if (!question) {
    return res.status(400).json({ answer: "Question missing." });
  }
  if (!pdfText) {
    return res.status(400).json({ answer: "No PDF uploaded yet. Please upload a PDF first." });
  }

  try {
    // Prepare the prompt for the Gemini API
    // We instruct the model to answer based on the provided context.
    const prompt = `Based on the following document text, answer the question. If the answer is not in the document, state that you cannot find it.

Document:
"${pdfText.slice(0, 8000)}" // Limit context to avoid exceeding token limits for the model
                               // Adjust this limit based on the model's actual context window.

Question: "${question}"

Answer:`;

    // Construct the payload for the Gemini API request
    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        // You can adjust temperature, topK, topP for different response styles
        temperature: 0.2, // Lower temperature for more focused answers
        maxOutputTokens: 500, // Limit the length of the generated answer
      },
    };

    // Define the Gemini API URL
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Make the fetch call to the Gemini API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Check for HTTP errors from the API
    if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API error response:", errorData);
        return res.status(response.status).json({ answer: `Gemini API error: ${errorData.error?.message || response.statusText}` });
    }

    const result = await response.json();

    // Extract the answer from the Gemini API response
    let answer = "No answer found in document.";
    if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
      answer = result.candidates[0].content.parts[0].text;
    }

    res.json({ answer: answer });
  } catch (error) {
    console.error("Error fetching answer from Gemini API:", error);
    res.status(500).json({ answer: "Error fetching answer from AI." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
