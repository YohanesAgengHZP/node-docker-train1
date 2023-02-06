const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');
const config = require('./config/config.js');

let RedisStore = require('connect-redis')(session);
let RedisClient = redis.createClient({
    host: config.REDIS_URL,
    port: config.REDIS_PORT,
});

const postRouter = require("./routes/postRoute.js");
const userRouter = require("./routes/userRoute.js");
const { SESSION_SECRET } = require('./config/config.js');


const app = express();

const mongoURL= `mongodb://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_IP}:${config.MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
    mongoose
    .connect(mongoURL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((e) => {
        console.log(e)
        setTimeout(connectWithRetry, 5000)
    });
}

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));
app.use(session({
    store: new RedisStore({client: RedisClient}),
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 60000 
    }
}));

app.use(express.json());

//localhost:4000/api/v1/post/
app.get("/api/v1", (req, res) => {
    res.send("<h2>its prod now</h2>");
    console.log("it ran");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);


const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`listening on port ${port}`));