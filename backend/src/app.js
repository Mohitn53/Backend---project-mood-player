const express = require('express')
const app = express()
const songRoutes = require('../src/routes/song.routes')

app.use(express.json())
app.use('/',songRoutes)
module.exports = app