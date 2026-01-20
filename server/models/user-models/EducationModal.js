import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const educationSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        student_class: { type: String, required: true },
        school: { type: String, required: true },
        academic_year: { type: String },
        description: { type: String, required: true },
        pursuing: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const UserEducation = MainDatabase.model("user-education", educationSchema);

export default UserEducation;
