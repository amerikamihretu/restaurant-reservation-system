import mongoose from 'mongoose';
export const connectDB = async () => {
    mongoose.set('bufferCommands', false); // CRITICAL: fail fast, don't hang
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/restaurant-reservation';
    try {
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 2000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.warn(`[AI Studio] MongoDB not connected (${error instanceof Error ? error.message : 'offline'}) — database fallback active`);
    }
};
