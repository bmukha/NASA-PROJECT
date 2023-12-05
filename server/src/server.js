import 'dotenv/config';
import http from 'http';

import app from './app.js';
import { connectToDB } from './services/mongo.js';
import { loadPlanetsData } from './models/planets.model.js';
import { loadLaunchData } from './models/launches.model.js';

const PORT = process.env.PORT || 8000;

export const server = http.createServer(app);

const startMongo = async () => {
  await connectToDB();
  await loadPlanetsData();
  await loadLaunchData();
};

startMongo().then(() => {
  server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
});
