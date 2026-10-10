import { Schema, model } from 'mongoose';
const tableSchema = new Schema({
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    tableNumber: {
        type: String,
        required: [true, 'Table number or identifier is required'],
        trim: true,
    },
    capacity: {
        type: Number,
        required: [true, 'Table capacity is required'],
        min: [1, 'Capacity must be at least 1 person'],
    },
    minSeats: {
        type: Number,
        default: 1,
        min: [1, 'Minimum seats must be at least 1 person'],
    },
    location: {
        type: String,
        trim: true,
        default: 'Indoor',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
// Ensure table numbers are unique per restaurant
tableSchema.index({ restaurant: 1, tableNumber: 1 }, { unique: true });
export const Table = model('Table', tableSchema);
