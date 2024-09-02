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

// Apply rate limiting early in the middleware stack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parser
app.use(express.json({ limit: '50mb' }));

// Cookie parser
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'https://admin-frontend-d37h.vercel.app', // Ensure this matches your frontend URL
  credentials: true,
}));

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
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);

export default app;
