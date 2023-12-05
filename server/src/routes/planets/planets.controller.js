import { getAllPlanets } from '../../models/planets.model.js';

export const httpGetAllPlanets = async (req, res) => {
  const planets = await getAllPlanets();
  res.json(planets);
};
