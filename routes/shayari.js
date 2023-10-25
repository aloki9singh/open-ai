// server.js


const express = require('express');
const axios = require('axios');
require("dotenv").config();
const  shayariRouter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
   
shayariRouter.get('/shayarigenerator', async (req, res) => {
    try {
        const { content_type, user_query } = req.body;
        let prompt = '';
        console.log('Received request:', { content_type, user_query });

        // Determine the prompt based on the content type
        if (content_type === 'shayari') {
            prompt = `Generate a Shayari about ${user_query}`;
        } else if (content_type === 'jokes') {
            prompt = `Tell a joke about ${user_query}`;
        } else if (content_type === 'short-stories') {
            prompt = `Write a short story about ${user_query}`;
        }else{
            prompt=user_query
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
          // Check if the response is valid and contains choices
          if (response.data.choices && response.data.choices[0]) {
            const gptResponse = response.data.choices[0].text;
            res.json({ response: gptResponse });
        } else {
            res.status(500).json({ error: "Invalid response from OpenAI API" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.',error });
    }
});
module.exports={
    shayariRouter
}