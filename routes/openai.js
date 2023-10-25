require("dotenv").config();
const express = require('express');
const OpenAiRouter = express.Router();
const axios=require('axios')
OpenAiRouter.get('/sayari',async (req,res)=>{
    try {
        const keyword = req.query.keyword;
        const type=req.query.type;
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
          prompt: `Generate a ${type} about ${keyword}`,
          max_tokens: 100,
          temperature: 0.7,
          n: 1
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        const shayari = response.data.choices[0].text.trim();
        res.json({ shayari });
      } catch (error) {
        console.error('Error:', error?.response?.data);
        res.status(500).json({ error: 'Something went wrong' });
      }
})

module.exports={
    OpenAiRouter
}