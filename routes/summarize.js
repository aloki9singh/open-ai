

const express = require('express');
const axios = require('axios');
require("dotenv").config();
const summarizeRouter = express.Router();
const bodyParser = require('body-parser');
const OPENAI_KEY = process.env.OPENAI_KEY;
const request = require('request-promise');
// app.use(bodyParser.json());

// Advanced Text Generation
summarizeRouter.post('/generate-text', async (req, res) => {
    const { messages } = req.body;
  
    const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
      messages: messages,
    }, {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
    })
  
    // Extract the last message as the model's response
    const modelResponse = response.data.choices[0].message.content;
  
    res.json({ response: modelResponse });
  });

  
  const documents = [
    "Document 1: This is the first document. It contains some text.",
    "Document 2: Here is the second document with more text.",
    "Document 3: The third document provides additional information.",
  ];
  function summarizeDocuments(documents) {
    // Combine all documents into one text
    const combinedText = documents.join(" ");
  
    // Perform a simple extractive summarization (word-based)
    const words = combinedText.split(" ");
    const summary = words.slice(0, 50).join(" "); // Get the first 50 words as a summary
  
    return summary
  }
summarizeRouter.post('/summarize-multi-doc', (req, res) => {
    const summary = summarizeDocuments(req.body.documents || documents);
  
    res.json({ summary });
  });
// // Text Summarization
// summarizeRouter.post('/summarize', async (req, res) => {
//     const { text } = req.body;
//     const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//       prompt: `Summarize: ${text}`,
//       max_tokens: 50,
//     }, {
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//     });
  
//     res.json({ summary: response.data.choices[0].text });
//   });
  

// // Translation
// summarizeRouter.post('/translate', async (req, res) => {
//   const { text, sourceLanguage, targetLanguage } = req.body;
//   const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//     prompt: `Translate the following text from ${sourceLanguage} to ${targetLanguage}: ${text}`,
//     max_tokens: 50,
//   }, {
//     headers: {
//       Authorization: `Bearer ${OPENAI_API_KEY}`,
//     },
//   });

//   res.json({ translation: response.data.choices[0].text });
// });

// // Sentiment Analysis
// summarizeRouter.post('/sentiment', async (req, res) => {
//     const { text } = req.body;
//     const response = await axios.post('https://api.openai.com/v1/engines/davinci/sentiment', {
//       documents: [text],
//     }, {
//       headers: {
//         Authorization: `Bearer ${OPENAI_API_KEY}`,
//       },
//     });
  
//     res.json({ sentiment: response.data });
//   });
  

  module.exports = {
    summarizeRouter
};
