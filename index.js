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
//app.use(express.static('./public'))
const path = require("path");

app.use(cors({
    origin: [
        "https://book-my-show-830p.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(express.json())
app.use('/api/users', userRouter);
app.use('/api/movies', movieRoute);
app.use('/api/theatres', theatreRoute);
app.use('/api/upcoming', upcomingRoute);
app.use('/api/bookings', bookingRoute);

app.use(express.static(path.join(__dirname, "public")));


// React SPA catch-all
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(process.env.PORT, () => {
    console.log(`server is listening to port no ${process.env.PORT}`)
})