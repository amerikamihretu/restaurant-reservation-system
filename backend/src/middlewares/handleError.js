export const handleError = (error, _req, res, _next) => {
    if (error instanceof SyntaxError && error.type === 'entity.parse.failed') {
        res.status(400).json({ status: 'error', message: 'Malformed JSON request' });
        return;
    }
    if (error.name === 'ZodError') {
        res.status(400).json({ status: 'error', message: 'Validation failed', errors: error.issues });
        return;
    }
    if (error.name === 'ValidationError') {
        res.status(400).json({ status: 'error', message: 'Database validation failed', errors: error.errors });
        return;
    }
    if (error.name === 'CastError') {
        res.status(400).json({ status: 'error', message: `Invalid ${error.path}` });
        return;
    }
    if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyPattern || {})[0];
        const messages = {
            email: 'An account with this email already exists',
            token: 'The session could not be created because of an outdated database index',
        };
        res.status(409).json({
            status: 'error',
            message: messages[duplicateField] || 'A record with those values already exists',
            field: duplicateField || undefined,
        });
        return;
    }
    const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
    if (status >= 500) console.error('[Error]', error.message);
    res.status(status).json({
        status: 'error',
        message: status < 500 ? error.message : 'Internal Server Error',
    });
};
