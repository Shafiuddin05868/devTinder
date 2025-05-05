import express from "express"
import { databaseConnect } from "./config/database.js"
import { User, userSchema } from "./models/user.js"

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

    //filters query parameters keys from the schema
    const keys = Object.keys(userSchema.obj).filter(key => key !== 'password')
    const queries = Object.keys(req.query) //get all query parameters
    queries.forEach(query => { //if the query parameters are in the schema keys then add it to the filter object
        if(keys.includes(query)){
            filter[query] = req.query[query]
        }
    })

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
