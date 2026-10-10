import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
export var UserRole;
(function (UserRole) {
    UserRole["CUSTOMER"] = "CUSTOMER";
    UserRole["RESTAURANT_OWNER"] = "RESTAURANT_OWNER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (UserRole = {}));
export var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "ACTIVE";
    AccountStatus["SUSPENDED"] = "SUSPENDED";
})(AccountStatus || (AccountStatus = {}));
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.CUSTOMER,
    },
    status: {
        type: String,
        enum: Object.values(AccountStatus),
        default: AccountStatus.ACTIVE,
    },
}, {
    timestamps: true,
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
// Compare entered password with hashed password in database
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
export const User = model('User', userSchema);
