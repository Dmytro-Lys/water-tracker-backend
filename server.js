import 'dotenv/config'
import mongoose from "mongoose";
import app from './app.js'

const {DB_CONNECT, PORT = 4000} = process.env;

mongoose.connect(DB_CONNECT)
  .then(() => {
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`)
    })
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })

