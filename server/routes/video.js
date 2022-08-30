const express = require('express');
const router = express.Router();
//const { Video } = require("../models/User");

const { auth } = require("../middleware/auth");
const multer = require("multer");
var ffmpeg = require("fluent-ffmpeg");

//=================================
//             Video
//=================================

 
router.post("/uploadfiles", (req, res) => {

    // Save videos into server
 
 }); 
 
 // STORAGE MULTER CONFIG
 let storage = multer.diskStorage({
     destination: (req, file, cb) => {
         cb(null, "uploads/");
     },
     filename: (req, file, cb) => {
         cb(null, `${Data.now()}_${file.originalname}`);
     },
     fileFilter: (req, file, cb) => {
         const ext = path.extname(file.originalname)
         if (ext !== '.mp4'){
             return cb(res.status(400).end('only mp4 is allowed'), false);
         }
         cb(null, true)
     }
    });

    const upload = multer({ storage: storage }).single("file");

    router.post('./uploadfiles', (req, res) => {
        
        upload(req, res, err => {
            if(err) {
                return res.json({ success: false, err})
            }
            return res.json({ success: true, url: res.req.file.path, fileName: res.req.file.filename })
        })
    })




    // Create Thumbnail and Get Running Time of the video
    router.post('./thumbnail', (req, res) => {

        let filePath = ""
        let fileDuration = ""

        // Get video info.
        ffmpeg.ffprobe(req.body.url, function(err, metadata) {
            console.dir(metadata); // all metadata
            console.log(metadata.format.duration);
            fileDuration = metadata.format.duration
        }); 

        // Create Thumbnail
        ffmpeg(req.body.url)
        .on('filenames', function(filenames) {
            console.log('Will generate ' + filenames.join(', '))
            console.log(filenames)

            filePath = "uploads/thumbnails/" + filenames[0]
        })
        .on('end', function() {
            console.log('Screenshots taken');
            return res.json({ success: true, url: filePath, fileDuration: fileDuration })
        })
        .on('error', function(err) {
            console.error(err);
            return res.json({ success: false, err });
        })
        .screenshots({

            // Will take screenshots at 20%, 40%, 60% and 80% of the video
            count: 3,
            folder: 'uploads/thumbnails',
            size: '320x240',
            // '%b': input basename (filename w/o extension)
            filename: 'thumbnail-%b.png'
        }) 
    })