import express from "express";
import { addContactUs } from "../controllers/enquiry-controller/ContactUsController.js";

const enquiryRoutes = express.Router();

enquiryRoutes.post(`/contact-us/add`, addContactUs);

export default enquiryRoutes;
