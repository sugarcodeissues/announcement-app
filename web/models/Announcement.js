import mongoose from 'mongoose';

const announcement_schema = new mongoose.Schema({
    shop: {
        type: String,
        required: true,
        trim: true,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Announcement = mongoose.model('Announcement', announcement_schema);

export default Announcement;