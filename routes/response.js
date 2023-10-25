

const express = require('express');
const axios = require('axios');
require("dotenv").config();
const ResponseRouter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;
   
ResponseRouter.get('/response', async (req, res) => {
    try {
        const { userQuery } = req.body;
        const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
            prompt: userQuery,
            temperature: 0.7,
        }, {
            headers: {
                "Authorization": `Bearer ${OPENAI_KEY}`,
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
        res.status(500).json({ error: "An error occurred.", errorMessage: error.message });
    }
});


module.exports={
    ResponseRouter
}