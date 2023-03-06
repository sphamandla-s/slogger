import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from 'dotenv';
import multer from "multer";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { signup } from './controllers/auth.js'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import postsRoutes from './routes/posts.js'
import {createPost} from './controllers/posts.js'
import { verifyToken } from "./middleware/auth.js";
const port = process.env.PORT | 3005;


// config
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, "public/assets")));


// file storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets")
    },
    filename: (req, file, cb) => {
        cb(null, file.filename)
    }

})

const upload = multer({ storage })

// i placed this routes direct from here because we want use the upload middleWare
app.post('/auth/signup/', upload.single('picture'), signup);
app.post('/posts/', verifyToken ,upload.single('picture'), createPost)

// i created a separate file for my routes
app.use('/auth', authRoutes);
app.use('/users', usersRoutes)
app.use('/posts', postsRoutes)


// Connect to the mango database and start the server
mongoose.connect('mongodb://localhost:27017/slogger').then(() => {
    app.listen(port, () => {
        console.log(`Listening to port ${port}`)
    })
}).catch(err => {
    console.log("There was an error")
    console.log(err)
});

