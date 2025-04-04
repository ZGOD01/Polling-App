const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI , {});
        console.log("MongDB Connected");
        
    } catch (err) {
        console.log("Error connecting to MongoDB" ,err);
        process.exit(1);
    }
}

module.exports = connectDB;