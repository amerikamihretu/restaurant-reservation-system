import mongoose from 'mongoose';
import crypto from 'node:crypto';
import { validateEnv } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { RefreshToken } from '../src/models/RefreshToken.js';
import { User } from '../src/models/User.js';

validateEnv();
await connectDB();

try {
    await User.syncIndexes();
    const legacyTokens = await mongoose.connection.db.collection('refreshtokens')
        .find({ tokenHash: { $exists: false } }, { projection: { _id: 1 } })
        .toArray();
    for (const legacyToken of legacyTokens) {
        const tokenHash = crypto.createHash('sha256')
            .update(`legacy-refresh-token:${legacyToken._id.toString()}`)
            .digest('hex');
        await mongoose.connection.db.collection('refreshtokens').updateOne(
            { _id: legacyToken._id },
            {
                $set: {
                    tokenHash,
                    revokedAt: new Date(),
                    expiresAt: new Date(),
                },
                $unset: { token: '' },
            },
        );
    }
    await RefreshToken.syncIndexes();
    console.log('User and refresh-token indexes synchronized.');
} finally {
    await mongoose.disconnect();
}
