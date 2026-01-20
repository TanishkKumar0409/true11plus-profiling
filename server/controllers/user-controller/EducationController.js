import mongoose from "mongoose";
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserEducation from "../../models/user-models/EducationModal.js";

export const upsertUserEducation = async (req, res) => {
    try {
        const {
            student_class,
            school,
            academic_year,
            description,
            pursuing,
            educationId,
        } = req.body;

        const userId = await getDataFromToken(req);

        if (!userId || !student_class || !school || !description) {
            return res.status(400).json({ error: "student_class, school, description are required", });
        }

        if (!pursuing && !academic_year) {
            return res.status(400).json({ error: "academic year is required", });
        }

        const cleanClass = student_class.trim();
        const cleanSchool = school.trim();
        const cleanAcademicYear = academic_year.trim();
        const cleanDescription = description.trim();

        const cleanPursuing = typeof pursuing === "boolean" ? pursuing : false;

        // ✅ UPDATE FLOW
        if (educationId) {
            if (!mongoose.Types.ObjectId.isValid(educationId)) {
                return res.status(400).json({ error: "Invalid educationId" });
            }

            // ✅ Prevent duplicate (same student_class + same school for same user)
            const duplicate = await UserEducation.findOne({
                userId,
                student_class: cleanClass,
                school: cleanSchool,
                _id: { $ne: educationId },
            });

            if (duplicate) {
                return res.status(409).json({
                    error: "This class already exists for the same school",
                });
            }

            const updated = await UserEducation.findOneAndUpdate(
                { _id: educationId, userId },
                {
                    $set: {
                        student_class: cleanClass,
                        school: cleanSchool,
                        academic_year: cleanAcademicYear,
                        description: cleanDescription,
                        pursuing: cleanPursuing,
                    },
                },
                { new: true }
            );

            if (!updated) {
                return res.status(404).json({ error: "Education not found" });
            }

            return res.status(200).json({
                message: "Education updated successfully",
                data: updated,
            });
        }

        // ✅ CREATE FLOW
        const existing = await UserEducation.findOne({
            userId,
            student_class: cleanClass,
            school: cleanSchool,
        });

        if (existing) {
            return res.status(409).json({
                error: "This class already exists for the same school",
            });
        }

        const created = await UserEducation.create({
            userId,
            student_class: cleanClass,
            school: cleanSchool,
            academic_year: cleanAcademicYear,
            description: cleanDescription,
            pursuing: cleanPursuing,
        });

        return res.status(201).json({
            message: "Education created successfully",
            data: created,
        });
    } catch (error) {
        console.error("upsertUserEducation error:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

export const getEducationByUserId = async (req, res) => {
    try {
        const { userId } = req.params
        const education = await UserEducation.find({ userId })

        return res.status(200).json(education)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong. please try again later." })
    }
}
export const deleteEducation = async (req, res) => {
    try {
        const { objectId } = req.params
        const delEdu = await UserEducation.findOneAndDelete({ _id: objectId })
        if (!delEdu) return res.status(404).json({ error: "No Education Found" })
        return res.status(200).json({ message: "Your Education Has Been Deleted" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong. please try again later." })
    }
}