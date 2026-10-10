import { User, AccountStatus } from '../models/User.js';
import { Restaurant, ApprovalStatus } from '../models/Restaurant.js';
import { Reservation, ReservationStatus } from '../models/Reservation.js';
// @desc    Get system-wide analytics metrics (ADMIN)
// @route   GET /api/v1/admin/analytics
export const getPlatformAnalytics = async (_req, res, next) => {
    try {
        const [totalUsers, usersByRole, totalRestaurants, restaurantsByStatus, totalReservations, reservationsByStatus,] = await Promise.all([
            User.countDocuments(),
            User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
            Restaurant.countDocuments(),
            Restaurant.aggregate([{ $group: { _id: '$approvalStatus', count: { $sum: 1 } } }]),
            Reservation.countDocuments(),
            Reservation.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        ]);
        // Format metrics into key-value maps
        const roleStats = usersByRole.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
        const restaurantStats = restaurantsByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
        const reservationStats = reservationsByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {});
        res.status(200).json({
            status: 'success',
            data: {
                users: {
                    total: totalUsers,
                    byRole: {
                        CUSTOMER: roleStats['CUSTOMER'] || 0,
                        RESTAURANT_OWNER: roleStats['RESTAURANT_OWNER'] || 0,
                        ADMIN: roleStats['ADMIN'] || 0,
                    },
                },
                restaurants: {
                    total: totalRestaurants,
                    byStatus: {
                        PENDING: restaurantStats[ApprovalStatus.PENDING] || 0,
                        APPROVED: restaurantStats[ApprovalStatus.APPROVED] || 0,
                        REJECTED: restaurantStats[ApprovalStatus.REJECTED] || 0,
                    },
                },
                reservations: {
                    total: totalReservations,
                    byStatus: {
                        PENDING: reservationStats[ReservationStatus.PENDING] || 0,
                        CONFIRMED: reservationStats[ReservationStatus.CONFIRMED] || 0,
                        CANCELLED: reservationStats[ReservationStatus.CANCELLED] || 0,
                        COMPLETED: reservationStats[ReservationStatus.COMPLETED] || 0,
                    },
                },
            },
        });
    }
    catch (error) { next(error); }
};
// @desc    Get paginated user list with role/status filters (ADMIN)
// @route   GET /api/v1/admin/users
export const getAllUsers = async (req, res, next) => {
    try {
        const { role, status, search, page = '1', limit = '10' } = req.query;
        const filter = {};
        if (role)
            filter.role = role;
        if (status)
            filter.status = status;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;
        const [users, total] = await Promise.all([
            User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
            User.countDocuments(filter),
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                users,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
        });
    }
    catch (error) { next(error); }
};
// @desc    Update user account status (Suspend / Reactivate) (ADMIN)
// @route   PATCH /api/v1/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!Object.values(AccountStatus).includes(status)) {
            res.status(400).json({ status: 'error', message: 'Invalid account status' });
            return;
        }
        // Prevent Admin from suspending their own account
        if (id === req.user?.userId) {
            res.status(400).json({ status: 'error', message: 'You cannot suspend your own administrative account' });
            return;
        }
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ status: 'error', message: 'User account not found' });
            return;
        }
        user.status = status;
        await user.save();
        res.status(200).json({
            status: 'success',
            message: `User account status updated to ${status}`,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
            },
        });
    }
    catch (error) { next(error); }
};
