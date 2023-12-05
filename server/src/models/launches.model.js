import axios from 'axios';
import launches from './launches.mongo.js';
import planets from './planets.mongo.js';

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-1652 b',
  customers: ['ZTM', 'NASA'],
  upcoming: 'true',
  success: 'true',
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort('-flightNumber');
  return latestLaunch ? latestLaunch.flightNumber : DEFAULT_FLIGHT_NUMBER;
};

const saveLaunch = async (launch) => {
  const response = await launches.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
  return response;
};

saveLaunch(launch);

export const getAllLaunches = async (skip, limit) => {
  try {
    const response = await launches
      .find({}, { _id: 0, __v: 0 })
      .sort({ flightNumber: 1 })
      .skip(skip)
      .limit(limit);
    return response;
  } catch (error) {
    console.log('Can not fetch launches', error);
  }
};

export const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('No matching planet found');
  }
  const newLaunch = {
    ...launch,
    flightNumber: (await getLatestFlightNumber()) + 1,
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
  };
  console.log('SCHEDULED LAUNCH', newLaunch);

  await saveLaunch(newLaunch);
  return newLaunch;
};

const findLaunch = async (filter) => await launches.findOne(filter);

export const existLaunchWithId = async (id) =>
  await findLaunch({ flightNumber: id });

export const abortLaunchById = async (id) => {
  const aborted = launches.updateOne(
    { flightNumber: +id },
    { upcoming: false, success: false }
  );

  return aborted;
};

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

export const populateLaunches = async () => {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  response.data.docs.map(async (doc) => {
    await saveLaunch({
      flightNumber: doc.flight_number,
      mission: doc.name,
      rocket: doc.rocket.name,
      launchDate: doc.date_local,
      upcoming: doc.upcoming,
      success: doc.success,
      customers: doc.payloads.flatMap((payload) => payload.customers),
    });
  });
};

export const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({ flightNumber: 1, rocket: 'Falcon 1' });

  if (firstLaunch) {
    console.log('Launch data already loaded');
    return;
  }

  await populateLaunches();
};
