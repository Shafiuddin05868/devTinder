import express from "express"
import { databaseConnect } from "./config/database.js"
import { User } from "./models/user.js"

const app = express()

app.use(express.json())

//user sign up
app.post("/signUp", async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.send("user create successfully")
  } catch (err) {
    res.status(400).send(err.message)
  }
})

//get all users
app.get("/users", async (req, res) => {
  try {
    const filter = {}
    if(req.query.email){
        filter.email = req.query.email
    }
    if(req.query.name){
        filter.name = req.query.name
    }
    if(req.query.age){
        filter.age = req.query.age
    }

    if(Object.keys(filter).length > 0 ){
        const users = await User.find(filter)
        users.length > 0 ? res.send(users) : res.status(404).send("No user found")
    }else{
        const users = await User.find()
        res.send(users)
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

//connect database and start server
;(async () => {
  try {
    await databaseConnect()
    app.listen(3000, () => {
      console.log("The server is running on port 3000")
    })
  } catch (err) {
    console.error(err, "cannot connect to the database")
  }
})()
