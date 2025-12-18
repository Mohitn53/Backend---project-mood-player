const express = require('express')
const app = express()
const cors = require('cors')
const songRoutes = require('../src/routes/song.routes')
app.use(cors())
app.use(express.json())
app.use('/',songRoutes)
module.exports = app