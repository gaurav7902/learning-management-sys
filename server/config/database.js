const mongoose = require("mongoose");

let connectionPromise;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 8000,
            })
            .catch((error) => {
                // Allow a later request to retry after a transient connection failure.
                connectionPromise = undefined;
                throw error;
            });
    }

    await connectionPromise;
    return mongoose.connection;
};

module.exports = connectToDatabase;
