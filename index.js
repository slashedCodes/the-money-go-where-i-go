const { exec } = require("node:child_process");
const multer = require('multer');
const ffmpegPath = require("ffmpeg-static");
const express = require("express");
const fs = require("node:fs");

const app = express();
const port = 3000;

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './')
    },
    filename: function (req, file, cb) {
        cb(null, 'temp.png')
    }
})

const upload = multer({ storage: storage })

app.post('/upload', upload.single('file'), async (req, res) => {
    if(fs.existsSync("temp.mp4")) fs.unlinkSync("temp.mp4")

    const command = `"${ffmpegPath}" -loop 1 -i temp.png -i money.ogg -shortest -c:v libx264 -tune stillimage -c:a aac -t 16.21 -pix_fmt yuv420p -vf "scale='in_w - mod(in_w, 2):in_h - mod(in_h, 2)',fade=t=in:st=0:d=1.2861" temp.mp4`
    exec(command).on('close', () => {
        res.sendFile("temp.mp4", {root: __dirname})
    })
})

app.listen(port, () => {
    console.log("App listening on port " + port + ".");
})