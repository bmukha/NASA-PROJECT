import express from 'express';

export const v1Router = express.Router();

import { planetsRouter } from './planets/planets.router.js';
import { launchesRouter } from './launches/launches.router.js';

v1Router.use('/planets', planetsRouter);
v1Router.use('/launches', launchesRouter);
