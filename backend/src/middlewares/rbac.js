export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                status: 'error',
                message: 'Authentication required prior to authorization check',
            });
            return;
        }
        const roles = allowedRoles.flat();
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                status: 'error',
                message: 'Access denied: insufficient permissions',
            });
            return;
        }
        next();
    };
};
