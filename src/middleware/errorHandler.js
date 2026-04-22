export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(" Error caught by Middleware:", err.message);
    
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : null,
    });
};