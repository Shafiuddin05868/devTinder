const express = require("express");

const app = express();

app.use('/user', (req, res, next)=>{
    console.log("hello 1");
    next()
})

app.use('/user', (req, res, next)=>{
    next()
    console.log("hello 2")
    res.send("hello 2")
})
app.use('/user', (req, res, next)=>{
    console.log("hello 3")
})

app.listen(3000, ()=>{
    console.log("The server is running at port 3000");
    
})