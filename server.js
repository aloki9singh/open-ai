

const express = require('express');
const cors=require('cors');
const authRoutes = require('./routes/auth');
const { connection } = require('./config/db');
const { OpenAiRouter } = require('./routes/openai');
const { ResponseRouter } = require('./routes/response');
const { themecontentRouter } = require('./routes/themecontent');
const { shayriRouter } = require('./routes/shayri');
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
app.use ("/response",ResponseRouter)
app.use ("/codeconverter",codeConverter)
app.use ("/generatequote", generatequoteRouter)
app.use ("/shayrigenerator", shayriRouter)
app.use ("/themedcontent",themecontentRouter)


app.listen(process.env.PORT,async () => {
  try{
    await connection
    console.log(`Server is running on PORT ${process.env.PORT}`);
   
  }catch(err){
    console.log('Error while connecting to DB')
  }
});






