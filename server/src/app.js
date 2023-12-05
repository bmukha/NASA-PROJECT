import express from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { v1Router } from './routes/v1.js';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(morgan('short'));
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(express.json());
app.use('/v1', v1Router);
app.use('/', (req, res) =>
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'))
);

export default app;
