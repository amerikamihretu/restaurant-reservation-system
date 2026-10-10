import { Restaurant, ApprovalStatus } from '../models/Restaurant.js';
import { isValidObjectId } from 'mongoose';
// @desc    Create a new restaurant profile
// @route   POST /api/v1/restaurants
// @access  Private - Restaurant Owner
export const createRestaurant = async (req, res, next) => {
    try {
        const ownerId = req.user?.userId;
        const existingRestaurant = await Restaurant.findOne({ owner: ownerId });
        if (existingRestaurant) {
            res.status(400).json({
                status: 'error',
                message: 'You have already registered a restaurant profile',
            });
            return;
        }
        const restaurant = await Restaurant.create({
            ...req.body,
            owner: ownerId,
            approvalStatus: ApprovalStatus.PENDING,
        });
        res.status(201).json({
            status: 'success',
            message: 'Restaurant profile created successfully and pending admin approval',
            data: { restaurant },
        });
    }
    catch (error) { next(error); }
};
// @desc    Get owner's restaurant profile
// @route   GET /api/v1/restaurants/mine
// @access  Private - Restaurant Owner
export const getMyRestaurant = async (req, res, next) => {
    try {
        const ownerId = req.user?.userId;
        const restaurant = await Restaurant.findOne({ owner: ownerId });
        if (!restaurant) {
            res.status(404).json({
                status: 'error',
                message: 'No restaurant profile found for this account',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: { restaurant },
        });
    }
    catch (error) { next(error); }
};
// @desc    Update owner's restaurant profile
// @route   PUT /api/v1/restaurants/mine
// @access  Private - Restaurant Owner
export const updateMyRestaurant = async (req, res, next) => {
    try {
        const ownerId = req.user?.userId;
        const restaurant = await Restaurant.findOne({ owner: ownerId });
        if (!restaurant) {
            res.status(404).json({
                status: 'error',
                message: 'No restaurant profile found to update',
            });
            return;
        }
        const approvalStatus = ApprovalStatus.PENDING;
        Object.assign(restaurant, {
            ...req.body,
            approvalStatus,
            rejectionReason: approvalStatus === ApprovalStatus.PENDING ? undefined : restaurant.rejectionReason,
        });
        await restaurant.save();
        res.status(200).json({
            status: 'success',
            message: 'Restaurant profile updated successfully',
            data: { restaurant },
        });
    }
    catch (error) { next(error); }
};
// @desc    Get all approved restaurants
// @route   GET /api/v1/restaurants
// @access  Public
export const getApprovedRestaurants = async (req, res, next) => {
    try {
        const { search, cuisine, city, page = '1', limit = '10' } = req.query;
        const query = { approvalStatus: ApprovalStatus.APPROVED };
        if (search) {
            query.$text = { $search: search };
        }
        if (cuisine) {
            query.cuisine = { $in: cuisine.split(',') };
        }
        if (city) {
            query['address.city'] = new RegExp(city, 'i');
        }
        const pageNumber = Math.max(Number.parseInt(page, 10), 1);
        const limitNumber = Math.min(Math.max(Number.parseInt(limit, 10), 1), 100);
        const skip = (pageNumber - 1) * limitNumber;
        const [restaurants, total] = await Promise.all([
            Restaurant.find(query)
                .select('-rejectionReason')
                .skip(skip)
                .limit(limitNumber)
                .sort({ createdAt: -1 }),
            Restaurant.countDocuments(query),
        ]);
        res.status(200).json({
            status: 'success',
            data: {
                restaurants,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(total / limitNumber),
                },
            },
        });
    }
    catch (error) { next(error); }
};
// @desc    Get restaurant details by ID
// @route   GET /api/v1/restaurants/:id
// @access  Public / Private
export const getRestaurantById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(400).json({ status: 'error', message: 'Invalid restaurant id' });
            return;
        }
        const restaurant = await Restaurant.findById(id).populate('owner', 'name email phone');
        if (!restaurant) {
            res.status(404).json({
                status: 'error',
                message: 'Restaurant not found',
            });
            return;
        }
        const isAdmin = req.user?.role === 'ADMIN';
        const isOwner = Boolean(restaurant.owner && restaurant.owner._id.toString() === req.user?.userId);
        if (restaurant.approvalStatus !== ApprovalStatus.APPROVED && !isAdmin && !isOwner) {
            res.status(403).json({
                status: 'error',
                message: 'Restaurant profile is pending approval',
            });
            return;
        }
        res.status(200).json({
            status: 'success',
            data: { restaurant },
        });
    }
    catch (error) { next(error); }
};
// @desc    Get restaurants for admin review
// @route   GET /api/v1/restaurants/admin/list
// @access  Private - Admin
export const getAdminRestaurants = async (req, res, next) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status && Object.values(ApprovalStatus).includes(status)) {
            filter.approvalStatus = status;
        }
        const restaurants = await Restaurant.find(filter)
            .populate('owner', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            status: 'success',
            data: { restaurants },
        });
    }
    catch (error) { next(error); }
};
// @desc    Approve or reject a restaurant profile
// @route   PATCH /api/v1/restaurants/:id/approval
// @access  Private - Admin
export const updateApprovalStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            res.status(404).json({
                status: 'error',
                message: 'Restaurant not found',
            });
            return;
        }
        restaurant.approvalStatus = status;
        restaurant.rejectionReason = status === ApprovalStatus.REJECTED ? rejectionReason : undefined;
        await restaurant.save();
        res.status(200).json({
            status: 'success',
            message: `Restaurant status updated to ${status}`,
            data: { restaurant },
        });
    }
    catch (error) { next(error); }
};
