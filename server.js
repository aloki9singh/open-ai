

const express = require('express');
const cors=require('cors');
const authRoutes = require('./routes/auth');
const { connection } = require('./config/db');
const { OpenAiRouter } = require('./routes/openai');
const { themecontentRouter } = require('./routes/themecontent');
const { shayariRouter } = require('./routes/shayari');
const { generatequoteRouter } = require('./routes/generatequote');
const { codeConverter } = require('./routes/codeConvert');
const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.get("/",(req,res)=>{
    res.send("Welcome to OPENAI Connection")
})
app.use('/auth', authRoutes);
app.use('/generate',OpenAiRouter)

app.use ("/api1",codeConverter)
app.use ("/api1", generatequoteRouter)
app.use ("/api1",shayariRouter)
app.use ("/api1",themecontentRouter)  


app.listen(process.env.PORT,async () => {
  try{
    await connection
    console.log(`Server is running on PORT ${process.env.PORT}`);
   
  }catch(err){
    console.log('Error while connecting to DB')
  }
});






