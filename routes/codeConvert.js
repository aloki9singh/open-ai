const express = require('express');
const axios = require('axios');
require("dotenv").config();
const codeConverter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;

codeConverter.post('/convert-code', async (req, res) => {
    const { code, sourceLanguage, targetLanguage } = req.body;

    if (!code || !sourceLanguage || !targetLanguage) {
        return res.status(400).json({ error: "code, sourceLanguage, and targetLanguage are required query parameters." });
    }

    const prompt = `Translate the following ${sourceLanguage} code to ${targetLanguage}:
${code}`;

    try {
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt,
            max_tokens: 200, 
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const convertedCode = response.data.choices[0].text;
        res.json({ convertedCode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.', error });
    }
});

module.exports = {
    codeConverter
};
