const express = require("express");
const axios = require("axios");
require("dotenv").config();
const summarizeRouter = express.Router();
const bodyParser = require("body-parser");
const OPENAI_KEY = process.env.OPENAI_KEY;
const request = require("request-promise");
// app.use(bodyParser.json());

// Advanced Text Generation
summarizeRouter.post("/generate-text", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
        },
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      // Extract the last message as the model's response
      const modelResponse = response.data.choices[0].message.content;

      res.json({ response: modelResponse });
    } else {
      res.status(500).json({ error: "No response from the model" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// // Text Summarization
// summarizeRouter.post('/summarize', async (req, res) => {
//     const { text } = req.body;
//     const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//       prompt: `Summarize: ${text}`,
//       max_tokens: 50,
//     }, {
//       headers: {
//         Authorization: `Bearer ${OPENAI_KEY}`,
//       },
//     });

//     res.json({ summary: response.data.choices[0].text });
//   });

// Translation
summarizeRouter.post("/translate", async (req, res) => {
  const { text, sourceLanguage, targetLanguage } = req.body;
  const response = await axios.post(
    "https://api.openai.com/v1/engines/davinci/completions",
    {
      prompt: `Convert the following sentences from ${sourceLanguage} to ${targetLanguage}:${text}`,
      max_tokens: 60,
      temperature: 0.5,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
    }
  );

  res.json({ translation: response.data.choices[0].text });
});

// // Sentiment Analysis

// summarizeRouter.post('/analyze-emotion', async (req, res) => {
//   try {
//     const { text, language } = req.body;

//     // Perform emotion recognition using your fine-tuned model.
//     const emotion = await recognizeEmotion(text, language);

//     // Perform sentiment analysis using a multilingual NLP model.
//     const sentiment = await analyzeSentiment(text, language);

//     res.json({ emotion, sentiment });
//   } catch (error) {
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

async function analyzeTextWithGPT(text, language) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci/completions",
      {
        prompt: text,
        max_tokens: 250,
        temperature: 0.7,
        n: 1,
        // Add other parameters as needed
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.data.choices && response.data.choices[0]) {
      const gptResponse = response.data.choices[0].text;
      const sentiment = analyzeSentiment(gptResponse, "English");
      const emotion = analyzeEmotion(gptResponse, "English");
      return { emotion, sentiment };
    } else {
      throw new Error("Invalid response from OpenAI API");
    }
  } catch (error) {
    console.log(error); // Log the error here
    throw error;
  }
}
function analyzeSentiment(text, language) {
  // Perform very basic sentiment analysis based on keywords
  text = text.toLowerCase();

  const positiveKeywords = ["happy", "good", "excellent"];
  const negativeKeywords = ["sad", "bad", "terrible"];

  let sentiment = "Neutral"; // Default to neutral

  for (const keyword of positiveKeywords) {
    if (text.includes(keyword)) {
      sentiment = "Positive";
      break; // Break once a positive keyword is found
    }
  }

  for (const keyword of negativeKeywords) {
    if (text.includes(keyword)) {
      sentiment = "Negative";
      break; // Break once a negative keyword is found
    }
  }

  return sentiment;
}

function analyzeEmotion(text) {
  text = text.toLowerCase();

  const happyKeywords = ["happy", "joyful", "excited"];
  const sadKeywords = ["sad", "unhappy", "depressed"];

  let emotion = "Neutral"; // Default to neutral

  for (const keyword of happyKeywords) {
    if (text.includes(keyword)) {
      emotion = "Happy";
      break; // Break once a happy keyword is found
    }
  }

  for (const keyword of sadKeywords) {
    if (text.includes(keyword)) {
      emotion = "Sad";
      break; // Break once a sad keyword is found
    }
  }

  return emotion;
}

summarizeRouter.post("/sentiment", async (req, res) => {
  try {
    const { text, language } = req.body;

    // Perform emotion recognition and sentiment analysis using GPT-3.5 language model.
    const { emotion, sentiment } = await analyzeTextWithGPT(text, language);

    res.json({ emotion, sentiment });
  } catch (error) {
    res.status(500).json({ error: "An error occurred", error }); // Log the error here
  }
});

// Placeholder for recognizing emotion (you'd implement this based on your model)
// async function recognizeEmotion(text, language) {
//   // Implement your emotion recognition logic here.
//   // Use your fine-tuned model to analyze the emotion expressed in the text.
//   // You can use TensorFlow, PyTorch, or another library for this task.
//   // Return the recognized emotion.
// }

// // Placeholder for performing sentiment analysis (using a multilingual model)
// async function analyzeSentiment(text, language) {
//   try {
//     // You can use an NLP model for sentiment analysis here.
//     // Implement sentiment analysis using a library like TensorFlow, PyTorch, or a third-party NLP library.
//     // Make sure to consider the text's language for accurate results.

//     // For illustration purposes, we'll simulate sentiment analysis with OpenAI GPT-3 (not recommended for production):
//     const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//       prompt: `Analyze the sentiment of the following text in ${language}:\n\n${text}`,
//       max_tokens: 50,
//       temperature: 0.7,
//       n: 1,
//     }, {
//       headers: {
//         'Authorization': `Bearer ${OPENAI_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.data.choices && response.data.choices[0]) {
//       const sentimentAnalysisResult = response.data.choices[0].text;
//       // Process and extract sentiment information as needed.
//       return sentimentAnalysisResult;
//     } else {
//       throw new Error('Invalid response from OpenAI API');
//     }
//   } catch (error) {
//     throw error;
//   }
// }

module.exports = {
  summarizeRouter,
};
