const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors')
const userRouter = require("./routes/userRouter");
const movieRoute = require('./routes/movieRoute');
const theatreRoute = require('./routes/theatreRoute');
const upcomingRoute = require('./routes/upcomingRoute');
const bookingRoute = require('./routes/bookingRoute');
const dbConfig = require("./config/dbconfig");
app.use(express.static('./public'))
app.use(cors())
app.use(express.json())
app.use('/api/users',userRouter);
app.use('/api/movies', movieRoute);
app.use('/api/theatres',theatreRoute);
app.use('/api/upcoming', upcomingRoute);
app.use('/api/bookings', bookingRoute);
app.listen(process.env.PORT,()=>{
    console.log(`server is listening to port no ${process.env.PORT}`)
})