// server.js

const express = require('express');
const axios = require('axios');
require("dotenv").config();
const  generatequoteRouter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
   
generatequoteRouter.post('/generate-quote', async (req, res) => {
    try {
        const { theme, length, genre } = req.body;
        let prompt = `Generate a ${length}-word ${genre} quote about ${theme}`;

        // Use ChatGPT or OpenAI GPT-3 to generate the quote based on the prompt
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt,
            // Add other parameters as needed
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract the generated quote from the GPT response
        const generatedQuote = response.data.choices[0].text;
        if (language === 'hindi') {
            generatedQuote = await translationService.translateToHindi(generatedQuote);
        } else if (language === 'english') {
            // Already in English, no translation needed
        } 

        res.json({ quote: generatedQuote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


module.exports={
  generatequoteRouter
}









