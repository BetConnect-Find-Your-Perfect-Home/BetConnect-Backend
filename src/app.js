import express from 'express';
import { errorHandler } from './middlewares/errorhandler.js';
import helmet from 'helmet';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use (errorHandler);
app.use(helmet());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
  }));
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'success',
        message: 'Server is healthy' });
})

export default app;