require("dotenv").config();
const express = require('express');
const cors = require('cors');
const axios=require('axios');
const multer = require('multer');
const fs = require('fs');
const PdfParse = require("pdf-parse");
const Sentiment = require("sentiment");
const sentimentRouter = express.Router()
sentimentRouter.use(express.json());
sentimentRouter.use(cors());
// Routes
sentimentRouter.get('/',(req,res)=>{
    return res.json({message:"You are at home"})
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Define the upload directory
  },
  filename: function (req, file, cb) {
    const date=new Date();
    cb(null, file.originalname+date.getTime());
  },
});

const upload = multer({ storage: storage });

sentimentRouter.post('/upload', upload.array('pdfFiles', 3), async (req, res) => {
  const { files } = req;
  const textContents = [];
  for (const file of files) {
    try {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await PdfParse(dataBuffer);
      textContents.push(data.text);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
    }
  }
  const sentimentAnalysisResults = [];

  // Perform sentiment analysis on the extracted text from each file
  textContents.forEach((text) => {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    sentimentAnalysisResults.push(result);
  });

  res.json({ sentimentAnalysisResults, message: 'Files uploaded and analyzed successfully' });
});

sentimentRouter.post('/sentiment',async (req,res)=>{
  const {text}=req.body;
    try {
        const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
          prompt: `Analyze the text below and determine the sentiment. Please categorize it into emotions like happy, sad, fearful, surprised, loving, angry, or if the person is feeling thirsty or hungry. Feel free to use other emotional terms as well. The provided text is: '${text}'.`,
          max_tokens: 5,
          temperature: 1,
          n: 1
        },{
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        const sentimate = response.data.choices[0].text.trim();
        res.json({ sentimate });
      } catch (error) {
        console.error('Error:', error?.response?.data);
        res.status(500).json({ error: 'Something went wrong' });
      }
})

module.exports={
  sentimentRouter
}