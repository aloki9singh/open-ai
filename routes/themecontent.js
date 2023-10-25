
const express = require('express');
const axios = require('axios');
require("dotenv").config();
const  themecontentRouter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
   
themecontentRouter.post('/generate-quote', async (req, res) => {
    try {
        const { theme } = req.body;
        let prompt = '';

        // Determine the prompt based on the selected theme
        if (theme === 'love') {
            prompt = 'Generate an inspirational love quote.';
        } else if (theme === 'life') {
            prompt = 'Generate a motivational life quote.';
        } else if (theme === 'success') {
            prompt = 'Generate a success-themed quote.';
        } else {
            // Add more themes and prompts as needed
        }

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

        res.json({ quote: generatedQuote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


module.exports={
    themecontentRouter
}