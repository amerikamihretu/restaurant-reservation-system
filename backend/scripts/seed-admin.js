import mongoose from 'mongoose';
import { validateEnv } from '../src/config/env.js';
import { connectDB } from '../src/config/db.js';
import { User, UserRole } from '../src/models/User.js';

const seedAdmin = async () => {
    validateEnv();
    const password = process.env.ADMIN_INITIAL_PASSWORD;
    if (!password || password.length < 12) {
        throw new Error('ADMIN_INITIAL_PASSWORD must be set to a protected value of at least 12 characters');
    }

    await connectDB();
    const email = 'admin@gmail.com';
    const existing = await User.findOne({ email }).select('+password');
    if (existing) {
        if (existing.role !== UserRole.ADMIN) {
            throw new Error('admin@gmail.com already belongs to a non-admin account');
        }
        console.log('Initial administrator already exists; no changes made.');
        return;
    }

    await User.create({
        name: 'admin',
        email,
        password,
        role: UserRole.ADMIN,
    });
    console.log('Initial administrator created.');
};

try {
    await seedAdmin();
} finally {
    await mongoose.disconnect();
}
