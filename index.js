const express = require('express')
const multer = require('multer')
const app = express()
const requestIp = require('request-ip');
const path = require("path")
const port = process.env.PORT || 3000

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    return cb(null, true);
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });


const ipMiddleware = function(req, res, next) {
    const clientIp = requestIp.getClientIp(req); 
    console.log("Client Requested: ", clientIp);
    next();
};

app.use(ipMiddleware)

app.post('/upload', upload.single('file'), (req, res, next) => {
    try {
        return res.status(201).json({
            message: 'File uploded successfully'
        });
    } catch (error) {
        console.error(error);
    }
});
app.get('/', (req, res) => {
    res.status(200).send('Hello world');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));