const express = require('express');
const axios = require('axios');
require("dotenv").config();
const codeConverter = express.Router();
const OPENAI_KEY = process.env.OPENAI_KEY;

const handleCodeConversion = async (code, targetLanguage) => {
    const prompt = `Convert the following ${targetLanguage} code to ${targetLanguage}: \n\n${code}`;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "user",
        "content": prompt
      }
    ],
       //temperature: 0,
      // max_tokens: 250,
      //stop: ["\n"],
     // top_p: 1.0,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
    });
    
    return response.data.choices[0].message.content;
  };
  
  codeConverter.post('/convert', async (req, res) => {
    const { code, targetLanguage } = req.body;
    try {
      const convertedCode = await handleCodeConversion(code, targetLanguage);
      res.json({ output: convertedCode });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  
  // for debugging and quality check 
  
  const handleCodeDebugging = async (code, targetLanguage) => {
    const prompt = `Debug the following ${targetLanguage} code: \n\n${code}`;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": prompt
        }
      ],
      //temperature: 0,
      max_tokens: 250,
      //stop: ["\n"],
     // top_p: 1.0,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
    });
    
    return response.data.choices[0].message;
  };
  
  codeConverter.post('/api/debug', async (req, res) => {
    const { code, targetLanguage } = req.body;
    try {
      const debuggingOutput = await handleCodeDebugging(code, targetLanguage);
      res.json({ debuggingOutput });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  
  
  
  const handleCodeQualityCheck = async (code, targetLanguage) => {
    const prompt = `Check the quality of the following ${targetLanguage} code: \n\n${code}`;
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          "role": "user",
          "content": prompt
        }
      ],
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
    });
    
    return response.data.choices[0].message;
  };
  
  codeConverter.post('/api/quality', async (req, res) => {
    const { code, targetLanguage } = req.body;
    try {
      const qualityOutput = await handleCodeQualityCheck(code, targetLanguage);
      res.json({ qualityOutput });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong' });
    }
  });
  

module.exports = {
    codeConverter
};
