const express = require('express')

const app = express()

// app.use("/", (req, res)=>{
//     res.send("This is my home!")
// });

// app.get('/user', (req, res)=>{
//     res.send({name: "Shafiuddin Chowdury", email: "shafiuddin05868@yendex.com"})
// })
app.get('/user/:id/:public', (req, res)=>{
    const {id, public} = req.params;
    res.send(id + public)
})

// app.get('/user',(req,res)=>{
//     res.send("lalalal")
// })

app.listen(3000, ()=> {
    console.log("The server is running on port 3000")
});