import {
  scheduleNewLaunch,
  existLaunchWithId,
  getAllLaunches,
  abortLaunchById,
} from '../../models/launches.model.js';

import { getPagination } from '../../services/query.js';

export const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  res.json(launches);
};

export const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }

  launch.launchDate = new Date(launch.launchDate);

  return res.status(201).json(await scheduleNewLaunch(launch));
};

export const httpAbortLaunch = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Invalid launch ID' });
  }

  const existLaunch = await existLaunchWithId(+id);
  if (!existLaunch) {
    return res.status(400).json({ error: 'Launch not found' });
  }

  const aborted = await abortLaunchById(+id);

  if (!aborted) {
    return res.status(400).json({ error: 'Launch not aborted' });
  }

  return res.status(200).json(aborted);
};
