import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const SkillSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    skill: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true })
const UserSkills = MainDatabase.model("User-skills", SkillSchema)
export default UserSkills