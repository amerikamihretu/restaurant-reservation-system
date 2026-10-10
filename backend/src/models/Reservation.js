import { Schema, model } from 'mongoose';
export var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "PENDING";
    ReservationStatus["CONFIRMED"] = "CONFIRMED";
    ReservationStatus["CANCELLED"] = "CANCELLED";
    ReservationStatus["COMPLETED"] = "COMPLETED";
})(ReservationStatus || (ReservationStatus = {}));
const reservationSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurant: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    table: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
    },
    date: {
        type: String,
        required: [true, 'Reservation date is required'],
        trim: true,
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        trim: true,
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        trim: true,
    },
    partySize: {
        type: Number,
        required: [true, 'Party size is required'],
        min: [1, 'Party size must be at least 1'],
    },
    status: {
        type: String,
        enum: Object.values(ReservationStatus),
        default: ReservationStatus.PENDING,
    },
    specialRequests: {
        type: String,
        trim: true,
        maxlength: [500, 'Special requests cannot exceed 500 characters'],
    },
    slotKeys: {
        type: [String],
        required: true,
    },
}, { timestamps: true });
// Compound index to quickly find reservations for a table on a specific date
reservationSchema.index({ table: 1, date: 1, status: 1 });
reservationSchema.index({ customer: 1, createdAt: -1 });
reservationSchema.index({ restaurant: 1, date: 1 });
reservationSchema.index(
    { table: 1, date: 1, slotKeys: 1 },
    { unique: true, partialFilterExpression: { status: { $in: [ReservationStatus.PENDING, ReservationStatus.CONFIRMED] } } },
);
export const Reservation = model('Reservation', reservationSchema);
