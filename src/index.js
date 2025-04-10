import dotenv from 'dotenv'
import { connectDB } from './DB/db.config.js'
import { app } from './app.js'


dotenv.config({
  path: "./.env"
})





connectDB()
  .then(() => {

    app.on('error', (error) => {
      console.log('Server error:', error);
      throw error;
    });
    
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at Port : ${process.env.PORT}`)
    })
  })
  .catch((error) => {
    console.log("MongoDB  Connection failed", error);
  })

