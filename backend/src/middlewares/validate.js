export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            const parsed = await schema.parseAsync(req.body);
            // Replace req.body with stripped/transformed Zod output
            req.body = parsed;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
