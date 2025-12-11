require('dotenv').config()
import express from 'express'
import helmet from "helmet";
import routes from './routes/routes';
import { connectDB } from './db/db';
import { corsConfig } from './middleware/cors-config';
import { globalRateLimiter } from './middleware/rate-limiting';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(corsConfig);
app.use(globalRateLimiter);
app.use(express.json());

connectDB();

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})