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

app.post('/auth/signup/', upload.single('picture'), signup);
app.use('/auth', authRoutes)

mongoose.connect('mongodb://localhost:27017/slogger').then(() => {
    app.listen(port, () => {
        console.log(`Listening to port ${port}`)
    })
}).catch(err => {
    console.log("There was an error")
    console.log(err)
});

