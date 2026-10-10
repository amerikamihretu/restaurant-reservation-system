import { Schema, model } from 'mongoose';
export var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
})(ApprovalStatus || (ApprovalStatus = {}));
const dayScheduleSchema = new Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
    },
    openTime: { type: String, required: true },
    closeTime: { type: String, required: true },
    isOpen: { type: Boolean, default: true },
}, { _id: false });
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true,
        maxlength: [100, 'Restaurant name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    cuisine: {
        type: [String],
        required: [true, 'At least one cuisine type is required'],
        validate: [(val) => val.length > 0, 'Please provide at least one cuisine'],
    },
    address: {
        street: { type: String, required: [true, 'Street address is required'] },
        city: { type: String, required: [true, 'City is required'] },
        state: { type: String, required: [true, 'State is required'] },
        zipCode: { type: String, required: [true, 'Zip code is required'] },
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // One restaurant per owner
    },
    approvalStatus: {
        type: String,
        enum: Object.values(ApprovalStatus),
        default: ApprovalStatus.PENDING,
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    operatingHours: {
        type: [dayScheduleSchema],
        required: [true, 'Operating hours are required'],
    },
    coverImage: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Index for text search and filtering approved restaurants
restaurantSchema.index({ name: 'text', cuisine: 'text' });
restaurantSchema.index({ approvalStatus: 1 });
export const Restaurant = model('Restaurant', restaurantSchema);
