import AcademicClass from "../../models/academic-structure-models/AcademicClass.js";

export const getAllAcademicClass = async (req, res) => {
  try {
    const allClasses = await AcademicClass.find();
    return res.status(200).json(allClasses);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
