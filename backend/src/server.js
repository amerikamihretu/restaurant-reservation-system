import { validateEnv } from './config/env.js';
import app from "./app.js";
import { connectDB } from './config/db.js';
const startServer = async () => {
    const port = process.env.PORT;
    if (!port) {
        throw new Error('FATAL CONFIG ERROR: PORT environment variable is missing.');
    }
    validateEnv();
    await connectDB();
    app.listen(port, () => {
        console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
    });
};
startServer();
