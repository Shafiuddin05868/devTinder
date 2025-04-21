const express = require('express');
const { adminAuth, userAuth } = require('./middlewares/auth');

const app = express();

app.use('/admin', adminAuth)

app.get('/admin', (req, res) => {
  res.send('Admin route');
});

app.post('/user', (req, res)=>{
  res.send('log in')
})

app.use('/user', userAuth)

app.get('/user', (req, res)=>{
  res.send('user list')
})



app.listen(3000,()=>{
  console.log("The server is running on port 3000")
})