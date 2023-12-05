import fs from 'fs';
import path from 'path';
import * as url from 'url';

import { parse } from 'csv-parse';

import planets from './planets.mongo.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const isHabitablePlanet = (planet) =>
  planet['koi_disposition'] === 'CONFIRMED' &&
  planet['koi_insol'] > 0.36 &&
  planet['koi_insol'] < 1.11 &&
  planet['koi_prad'] < 1.6;

const savePlanet = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (error) {
    console.log('Could not save a planet', error);
  }
};

export const loadPlanetsData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', 'data', 'kepler_data.csv'))
      .pipe(parse({ comment: '#', columns: true }))
      .on(
        'data',
        async (data) => isHabitablePlanet(data) && (await savePlanet(data))
      )
      .on('end', async () => {
        const planetsFound = await getAllPlanets();
        console.log(`${planetsFound.length} habitable planets found`);
        resolve();
      })
      .on('error', (error) => {
        console.log(error);
        reject();
      });
  });
};

export const getAllPlanets = async () =>
  await planets.find({}, { _id: 0, __v: 0 });
