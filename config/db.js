const mongoose=require('mongoose');

const connection=mongoose.connect('mongodb+srv://alok:alok@cluster0.zg2cqab.mongodb.net/openai?retryWrites=true&w=majority');
module.exports={
    connection
}