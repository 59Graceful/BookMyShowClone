const mongoose = require('mongoose');

// if (!process.env.MongoDbUrl) {
//     console.error('MongoDbUrl not set in environment variables');
//     process.exit(1);
// }

mongoose.connect(process.env.MongoDbUrl);
const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('Connection Successful');
});

connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
