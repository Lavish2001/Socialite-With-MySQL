const express = require('express');
const app = express();
const dotenv = require('dotenv');
const sequelize = require('./config');
const cors = require('cors');
const userAuthRoute = require('./Api_Routes/Authorization');
const userRoute = require('./Api_Routes/Users');
const loginAuth = require('./Middlewares/login_auth');
const messageRoute = require('./Api_Routes/Messages');
const multer = require('multer');
const path = require('path');
const dir = (__dirname + '/' + 'Public/Posts');
const Post = require('./Table_Models/post');



// Configure dotEnv File

dotenv.config();



// Connecting To Mysql

// sequelize.sync().then((result) => {
//     console.log('Connected');
// }).catch((err) => {
//     console.log('ERROR')
// });



// Configure Store For Uploading Files

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/Posts/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
    }

});



// Upload File Function

const upload = multer({
    storage: storage, limits: { fileSize: 1024 * 1024 * 50, fieldNameSize: 100 }, fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg"
            || file.mimetype == "video/mp4" || file.mimetype == "video/avi" || file.mimetype == "video/mkv") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg for image and .mp4, .mkv and .avi for video format allowed!'));
        }
    }
}).single('file');



// Upload File Route

app.post('/user/uploadpost', loginAuth, async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    'status': 'failed',
                    'message': err.message
                })
            } else {
                if (req.file) {
                    await Post.create({
                        ownerId: req.user.id,
                        image: req.file.filename,
                        description: req.body.description
                    });
                    return res.status(200).json({
                        'status': 'success',
                        'message': 'file uploaded successfully'
                    })
                } else {
                    return res.status(400).json({
                        'status': 'failed',
                        'message': 'select a file first'
                    })
                }
            }
        })
    } catch (err) {
        return res.status(500).json({
            'status': 'Failed',
            'message': err.message
        })
    }
});



// Directory For Posts and Images

app.use('/Images', express.static(path.join(dir)));



// Middlewares

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Routes

app.use('/user', userAuthRoute);
app.use('/user', loginAuth, userRoute);
app.use('/user', loginAuth, messageRoute);



// Server Port

app.listen(process.env.PORT, () => {
    console.log(`Your Server is Running on Port : ${process.env.PORT}`)
});