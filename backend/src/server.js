import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './logger.js';

// Import routes
import metaRoutes from './meta/meta.routes.js';
import authRoutes from './auth/auth.routes.js';
import requestRoutes from './requests/requests.routes.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(logger);

// Mount routes
app.use('/api', metaRoutes);
app.use('/api/auth', authRoutes);   // <---- This must be exactly here
app.use('/api', requestRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
