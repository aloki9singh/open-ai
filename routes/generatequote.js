require("dotenv").config();
const express = require('express');
const QuoteRouter = express.Router();
const axios = require('axios');

QuoteRouter.get('/quote', async (req, res) => {
    try {
        const keyword = req.query.keyword; // The keyword for the quote

        // Generate an English quote
        const responseEn = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            prompt: `Generate a famous quote about ${keyword}`,
            max_tokens: 100,
            temperature: 0.7,
            n: 1
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Generate a Hindi quote
        const responseHi = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
            prompt: `हिंदी में ${keyword} के बारे में एक प्रसिद्ध कथन बनाएँ`,
            max_tokens: 200,
            temperature: 0.7,
            n: 1
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const quoteEn = responseEn.data.choices[0].text.trim();
        const quoteHi = responseHi.data.choices[0].text.trim();

        res.json({ quoteEn, quoteHi });
    } catch (error) {
        console.error('Error:', error?.response?.data);
        res.status(500).json({ error: 'Something went wrong', error });
    }
});

module.exports = {
    QuoteRouter
};
