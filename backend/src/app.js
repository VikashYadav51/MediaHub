import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.router.js'
import channelRouter from './routes/channel.router.js'

const app = express();

const coreOptions = {
    origin : process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true,
}


// Set the middlewares.........
app.use(cors(coreOptions));
app.use(express.json({limit : '200kb'}));
app.use(express.urlencoded({extended : true, limit : '200kb'}));
app.use(express.static('public'));
app.use(cookieParser(process.env.COOKIE_SECRET));


// Routing.......
app.use('/api/v1/user', userRouter);
app.use('/api/v1/video', videoRouter);
app.use('/api/v1/channel', channelRouter);
// app.use('/api/v1/subscription', subscriptionRouter);



// Global Error Handler
app.use((err, req, res, next) =>{
    console.log(`Gobal error is ${err}`)
    res.status(err.statusCode || 500)
    .json({
        success : false,
        message : err.message,
        err : err.error || err,
        stack : err.stack,
    });
});


export default app;