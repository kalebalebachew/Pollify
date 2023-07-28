const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect('',{

useNewUrlParser: true,

})

app.use('view engine','ejs')
app.use(express.urlencoded())



app.listen(5000,(err,res)=>{
if(err) throw console.err('Failed to connect to the server')

res.send(console.log("server is listening on port 500"))
})