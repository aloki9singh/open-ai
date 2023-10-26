const express = require('express');
const axios = require('axios');
require("dotenv").config();
const shayariRouter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;

shayariRouter.get('/shayarigenerator', async (req, res) => {
    try {
        const { content_type, user_query } = req.query;
        let promptEn = '';
        let promptHi = '';
        console.log('Received request:', { content_type, user_query });

        // Determine the prompts based on the content type
        if (content_type === 'shayari') {
            promptEn = `Generate a meaningful Shayari about ${user_query} in English`;
            promptHi = `इस हिंदी शायरी में, ${user_query} के बारे में एक दिल को छूने वाला संदेश है`;
        } else if (content_type === 'jokes') {
            promptEn = `Tell a heartwarming joke about ${user_query} in English`;
            promptHi = `इस हिंदी मजाक में, ${user_query} के लिए एक मनोरंजन संदेश है`;
        } else if (content_type === 'short-stories') {
            promptEn = `Write a meaningful short story about ${user_query} in English`;
            promptHi = `इस हिंदी छोटी कहानी में, ${user_query} के बारे में एक दिल को छूने वाला संदेश है`;
        } else {
            // Handle other content types
            promptEn = `Generate meaningful content in English about ${user_query}`;
            promptHi = `इस हिंदी माध्यम से, ${user_query} के बारे में एक दिल को छूने वाला संदेश है`;
        }

        // Use ChatGPT or OpenAI GPT-3 to generate content based on the prompts
        const responseEn = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: promptEn,
            max_tokens: 250,
            temperature:0.7
            ,n: 1
            // Add other parameters as needed
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const responseHi = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: promptHi,
            max_tokens: 250,
            temperature:0.7
            ,n: 1
            // Add other parameters as needed
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Check if the responses are valid and contain choices
        if (responseEn.data.choices && responseEn.data.choices[0] && responseHi.data.choices && responseHi.data.choices[0]) {
            const gptResponseEn = responseEn.data.choices[0].text;
            const gptResponseHi = responseHi.data.choices[0].text;

            res.json({ shayariEn: gptResponseEn, shayariHi: gptResponseHi });
        } else {
            res.status(500).json({ error: "Invalid response from OpenAI API" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.', error });
    }
});

module.exports = {
    shayariRouter
};
