import express from "express";
import {
  getCity,
  getCityByState,
  getCountry,
  getLanguages,
  getSkills,
  getState,
  getStateByCountry,
} from "../controllers/extra-controller/ExtraControllers.js";

const extraRoutes = express.Router();

extraRoutes.get(`/countries`, getCountry);
extraRoutes.get(`/states`, getState);
extraRoutes.get(`/states/country/:country_name`, getStateByCountry);
extraRoutes.get(`/cities`, getCity);
extraRoutes.get(`/cities/state/:state_name`, getCityByState);

extraRoutes.get(`/languages`, getLanguages);
extraRoutes.get(`/skills`, getSkills);

export default extraRoutes;
