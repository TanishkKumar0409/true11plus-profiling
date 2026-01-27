import mongoose from "mongoose";
import Category from "../../models/system-assets/Category.js";
import { downloadImageAndReplaceSrc } from "../../utils/EditorImagesController.js";

export const createCategory = async (req, res) => {
  try {
    const { category_name, description, parent_category } = req.body;

    if (!category_name || typeof category_name !== "string") {
      return res.status(400).json({ error: "Category name is required" });
    }

    if (!parent_category) {
      return res.status(400).json({ error: "Parent Category is Required" });
    }

    const existing = await Category.findOne({ category_name });

    if (existing) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const catCount = await Category.countDocuments();

    let parentId = null;

    if (catCount === 0) {
      parentId = null;
    } else {
      const parentRaw =
        typeof parent_category === "string" ? parent_category.trim() : "";

      const noParentValues = ["", "null", "undefined", "uncategorized"];

      if (parentRaw && !noParentValues.includes(parentRaw.toLowerCase())) {
        if (!mongoose.Types.ObjectId.isValid(parentRaw)) {
          return res.status(400).json({ error: "Invalid parent_category id" });
        }

        const parentExists = await Category.findById(parentRaw);

        if (!parentExists) {
          return res.status(404).json({ error: "Parent category not found" });
        }

        parentId = parentExists._id;
      }
    }

    let updatedDescription = description;
    if (description) {
      updatedDescription = await downloadImageAndReplaceSrc(
        description,
        "category",
      );
    }
    const payload = {
      category_name,
      description: updatedDescription,
      parent_category: parentId,
    };

    await Category.create(payload);

    return res.status(201).json({ message: "Category created successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
export const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { objectId } = req.params;
    const deletedcategory = await Category.findByIdAndDelete(objectId);

    if (!deletedcategory)
      return res.status(404).json({ error: "Category not found." });

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { objectId } = req.params;
    const { category_name, parent_category, description, status } = req.body;

    const category = await Category.findById(objectId);
    if (!category) {
      return res.status(404).json({ error: "Category not found." });
    }

    const existingCategory = await Category.findOne({
      category_name,
      parent_category,
      _id: { $ne: objectId },
    });

    if (existingCategory) {
      return res.status(400).json({
        error: "Category name already exists under the same parent category.",
      });
    }

    let updatedDescription = description;
    if (existingCategory?.description !== description) {
      if (description) {
        updatedDescription = await downloadImageAndReplaceSrc(
          description,
          "category",
        );
      }
    }

    await Category.findByIdAndUpdate(
      objectId,
      {
        category_name,
        parent_category,
        description: updatedDescription,
        status,
      },
      { new: true },
    );

    return res.status(200).json({ message: "Category updated successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again." });
  }
};
