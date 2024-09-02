import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { ErrorMiddleware } from './middleware/error';
import userRouter from './routes/user.route';
import courseRouter from './routes/course.route';
import orderRouter from './routes/order.route';
import notificationRouter from './routes/notification.route';
import analyticsRouter from './routes/analytics.route';
import layoutRouter from './routes/layout.route';

const app = express();

// Apply CORS middleware
app.use(cors({
    origin: 'https://admin-frontend-d37h.vercel.app', // Replace with your frontend domain
    credentials: true, // Allow cookies to be sent with requests
}));

// Handle OPTIONS requests for CORS preflight
app.options('*', cors({
    origin: 'https://admin-frontend-d37h.vercel.app',
    credentials: true,
}));

// Apply rate limiting middleware early
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (15 minutes)
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/v1', userRouter, orderRouter, courseRouter, notificationRouter, analyticsRouter, layoutRouter);

// Testing route
app.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is working',
    });
});

// Handle unknown routes
app.all('*', (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`) as Error & { statusCode?: number };
    err.statusCode = 404;
    next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);

export default app;
