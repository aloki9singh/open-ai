

const express = require('express');
const cors=require('cors');
const authRoutes = require('./routes/auth');
const { connection } = require('./config/db');
const { themecontentRouter } = require('./routes/themecontent');
const { shayariRouter } = require('./routes/shayari');
const { QuoteRouter } = require('./routes/generatequote');
const { codeConverter } = require('./routes/codeConvert');
const { summarizeRouter } = require('./routes/summarize');
const app = express();
app.use(express.json());
app.use(cors());
const bodyParser = require('body-parser');
const { sentimentRouter } = require('./routes/sentiment');
 app.use(bodyParser.json());

// Routes
app.get("/",(req,res)=>{
    res.send("Welcome to OPENAI Connection")
})
app.use('/auth', authRoutes);
app.use ("/api1", codeConverter)
app.use ("/api1", QuoteRouter)
app.use ("/api1",shayariRouter)
app.use ("/api1",themecontentRouter)  
app.use ("/api1",summarizeRouter)  
app.use ("/v2", sentimentRouter)  


app.listen(process.env.PORT,async () => {
  try{
    await connection
    console.log(`Server is running on PORT ${process.env.PORT}`);
   
  }catch(err){
    console.log('Error while connecting to DB')
  }
});






