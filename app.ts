import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";

export const app = express();

// Apply rate limiting early in the middleware stack
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// Body parser
app.use(express.json({ limit: "50mb" }));

// Cookie parser
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'https://adminhttps-github-com-pizzou-admin-frontend.vercel.app'
];

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed: boolean) => void) => {
    if (allowedOrigins.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true, // if you need to send cookies or use authorization headers
};

app.use(cors(corsOptions));

// Test CORS route
app.get('/api/v1/me', (req, res) => {
  res.json({ message: 'CORS is configured correctly!' });
});

// Routes
app.use(
  "/api/v1",
  userRouter,
  orderRouter,
  courseRouter,
  notificationRouter,
  analyticsRouter,
  layoutRouter
);

// Test route
app.get("/test", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// Handle unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

// Error handling middleware
app.use(ErrorMiddleware);
