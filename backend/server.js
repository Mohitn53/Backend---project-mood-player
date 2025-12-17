require('dotenv').config()

const app = require('../backend/src/app')
const connectToDB = require('../backend/src/db/db')
connectToDB()
app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})