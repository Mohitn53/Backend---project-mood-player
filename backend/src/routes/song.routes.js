const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer({storage:multer.memoryStorage()})

router.get('/song',upload.single('url'),async(req,res)=>{
    console.log(req.body)
    console.log(req.file)
})


module.exports = router