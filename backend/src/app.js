import express from 'express'
import { databaseConnect } from './config/database.js';

const app = express();

 const initializeDatabase = ()=>{
  try {
     databaseConnect()
     app.listen(3000,()=>{
       console.log("The server is running on port 3000")
     })
  } catch (err) {
    console.error(err, 'cannot connect to the database')
  }
}
initializeDatabase()
