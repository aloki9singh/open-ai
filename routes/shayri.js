// server.js


const express = require('express');
const axios = require('axios');
require("dotenv").config();
const  shayriRouter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
   
shayriRouter.post('/generate-content', async (req, res) => {
    try {
        const { content_type, user_query } = req.body;
        let prompt = '';

        // Determine the prompt based on the content type
        if (content_type === 'shayari') {
            prompt = `Generate a Shayari about ${user_query}`;
        } else if (content_type === 'jokes') {
            prompt = `Tell a joke about ${user_query}`;
        } else if (content_type === 'short-stories') {
            prompt = `Write a short story about ${user_query}`;
        }

        // Use ChatGPT or OpenAI GPT-3 to generate content based on the prompt
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt,
            // Add other parameters as needed
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract the generated content from the GPT response
        const generatedContent = response.data.choices[0].text;

        res.json({ content: generatedContent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});
module.exports={
    shayriRouter
}