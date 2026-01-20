
import { getDataFromToken } from "../../utils/getDataFromToken.js";
import UserExperience from "../../models/user-models/ExperienceModal.js";

export const createUserExperience = async (req, res) => {
  try {
    const {
      title,
      company,
      start_date,
      end_date,
      iscurrently,
      description,
      experienceId,
    } = req.body;

    const userId = await getDataFromToken(req);

    if (!userId || !title || !company || !start_date || !description) {
      return res.status(400).json({
        error: "title, company, start_date, description are required",
      });
    }

    const cleanTitle = title.trim();
    const cleanCompany = company.trim();

    if (experienceId) {
      const duplicate = await UserExperience.findOne({
        userId,
        title: cleanTitle,
        company: cleanCompany,
        _id: { $ne: experienceId },
      });

      if (duplicate) {
        return res.status(409).json({
          error: "This title already exists for the same company",
        });
      }

      const updated = await UserExperience.findOneAndUpdate(
        { _id: experienceId, userId },
        {
          $set: {
            title: cleanTitle,
            company: cleanCompany,
            start_date,
            end_date: end_date || null,
            iscurrently: iscurrently,
            description: description.trim(),
          },
        },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Experience not found" });
      }

      return res.status(200).json({
        message: "Experience updated successfully",
        data: updated,
      });
    }

    // ✅ CREATE FLOW (when experienceId is NOT provided)
    const existing = await UserExperience.findOne({
      userId,
      title: cleanTitle,
      company: cleanCompany,
    });

    if (existing) {
      return res.status(409).json({
        error: "This title already exists for the same company",
      });
    }

    const created = await UserExperience.create({
      userId,
      title: cleanTitle,
      company: cleanCompany,
      start_date,
      end_date: end_date || null,
      iscurrently: iscurrently,
      description: description.trim(),
    });

    return res.status(201).json({
      message: "Experience created successfully",
      data: created,
    });
  } catch (error) {
    console.error("createUserExperience error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};


export const getExperienceByUserId = async (req, res) => {
  try {
    const { userId } = req.params
    const experience = await UserExperience.find({ userId })

    return res.status(200).json(experience)
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong. please try again later." })
  }
}
export const deleteExperiece = async (req, res) => {
  try {
    const { objectId } = req.params
    const delExp = await UserExperience.findOneAndDelete({ _id: objectId })
    if (!delExp) return res.status(404).json({ error: "No Experience Found" })
    return res.status(200).json({ message: "Your Expereinece Has Been Deleted" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong. please try again later." })
  }
}