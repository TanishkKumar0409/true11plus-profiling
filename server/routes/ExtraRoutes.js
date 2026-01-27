import express from "express";
import {
  getCity,
  getCountry,
  getLanguages,
  getState,
} from "../controllers/extra-controller/ExtraControllers.js";

const extraRoutes = express.Router();

extraRoutes.get(`/countries`, getCountry);
extraRoutes.get(`/states`, getState);
extraRoutes.get(`/cities`, getCity);

extraRoutes.get(`/languages`, getLanguages);

export default extraRoutes;
