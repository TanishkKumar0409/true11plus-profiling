import mongoose from "mongoose";
import { MainDatabase } from "../../database/Databases.js";

const CategorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    parent_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    status: {
      type: String,
      default: "active",
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

CategorySchema.pre("save", async function () {
  try {
    if (!this.isNew) return;
    const count = await MainDatabase.model("Category").countDocuments();
    if (count === 0) {
      this.parent_category = this._id;
    }
  } catch (err) {
    console.log(err);
  }
});

const Category = MainDatabase.model("Category", CategorySchema);

export default Category;
