const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')

mongoose.connect(MONGOURI);
mongoose.connection.on('connected',()=>{
    console.log('connected to database successfuly');
})
mongoose.connection.on('error',(err)=>{
    console.log('error in database connection',err)
})

require('./model/user')
require('./model/post')

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(PORT,()=>{
    console.log('listening to Port no ',PORT)
})