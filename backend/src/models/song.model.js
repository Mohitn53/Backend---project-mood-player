const mongoose = require('mongoose')
const songSchema =  new mongoose.Schema({
    title:String,
    artist:String,
    url:String
})


const songModel = mongoose.Model('song',songSchema)

module.exports = songModel