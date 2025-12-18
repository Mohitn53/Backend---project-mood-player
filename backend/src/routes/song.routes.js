const express = require('express')
const multer = require('multer')
const uploadFile = require('../services/storage.service')
const router = express.Router()
const upload = multer({storage:multer.memoryStorage()})
const songModel = require('../models/song.model')

router.post('/song',upload.single('url'),async(req,res)=>{
    console.log(req.body)
    console.log(req.file)
    const fileData = await uploadFile(req.file)
    const song = await songModel.create({
        title:req.body.title,
        artist:req.body.artist,
        url:fileData.url,
        mood:req.body.mood
    })
    console.log(fileData)
    res.status(201).json({
        "message":"File uploaded sucessfully",
        "song":song
    })
})
router.get('/song',async(req,res)=>{
    const {mood} = req.query
    console.log(mood)
    const songs = await songModel.find({
        mood:mood
    })
    res.status(200).json({
        songs
    })
})

module.exports = router