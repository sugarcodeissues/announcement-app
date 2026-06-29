import mongoose from 'mongoose';

const connect_db = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }
        await mongoose.connect(uri);
        console.log('[DB] MongoDB connected');
    } catch (error) {
        console.error(error.message);
        console.error(error.cause);
        console.error(error);
        process.exit(1);
    }
};

export default connect_db;