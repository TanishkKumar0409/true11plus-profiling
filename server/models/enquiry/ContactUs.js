import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const contactusScheam = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_no: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const ContactUs = MainDatabase.model("contact-us", contactusScheam);
export default ContactUs;
