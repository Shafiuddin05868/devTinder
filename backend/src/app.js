import express from "express";
import { databaseConnect } from "./config/database.js";
import { User } from "./models/user.js";

const app = express();

app.use(express.json());
app.post("/signUp", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("user create successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
//connect database and start server
(() => {
  try {
    databaseConnect();
    app.listen(3000, () => {
      console.log("The server is running on port 3000");
    });
  } catch (err) {
    console.error(err, "cannot connect to the database");
  }
})();
