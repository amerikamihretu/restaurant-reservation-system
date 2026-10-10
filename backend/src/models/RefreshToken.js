import { Schema, model } from 'mongoose';
const refreshTokenSchema = new Schema({
    tokenHash: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedByHash: { type: String, default: null },
}, { timestamps: true });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const RefreshToken = model('RefreshToken', refreshTokenSchema);
