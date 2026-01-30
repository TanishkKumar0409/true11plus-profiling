import { useRef } from "react";
import { useFormik } from "formik";
import {
  BiImage,
  BiFile,
  BiX,
  BiPaperPlane,
  BiLoaderAlt,
} from "react-icons/bi";
import toast from "react-hot-toast";
import { API } from "../../../contexts/API";
import { getErrorResponse } from "../../../contexts/CallBacks";
import type { UserProps } from "../../../types/UserTypes";

interface Task {
  _id: string;
  title?: string;
  [key: string]: any;
}

interface TaskSubmissionFormProps {
  task: Task;
  student: UserProps | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormValues {
  message: string;
  files: File[];
  images: File[];
}

export default function TaskSubmissionForm({
  task,
  student,
  onSuccess,
  onCancel,
}: TaskSubmissionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_DOC_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  const formik = useFormik<FormValues>({
    initialValues: {
      message: "",
      files: [],
      images: [],
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (
        !values.message &&
        values.files.length === 0 &&
        values.images.length === 0
      ) {
        toast.error("Please add a message or attach files before submitting.");
        setSubmitting(false);
        return;
      }

      try {
        const formData = new FormData();
        formData.append("task_id", task._id);
        formData.append("user_id", student?._id || "");
        formData.append("message", values.message);

        values.files.forEach((file) => {
          formData.append("files", file);
        });

        values.images.forEach((image) => {
          formData.append("images", image);
        });

        const response = await API.post("/user/task/submission", formData);

        toast.success(response.data.message || "Task submitted successfully!");
        if (onSuccess) onSuccess();
        resetForm();
      } catch (error) {
        getErrorResponse(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      const validFiles = selectedFiles.filter((file) =>
        ALLOWED_DOC_TYPES.includes(file.type),
      );

      if (validFiles.length !== selectedFiles.length) {
        toast.error("Only PDF, Word, Excel, and PowerPoint files are allowed.");
      }

      formik.setFieldValue("files", [...formik.values.files, ...validFiles]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);

      if (formik.values.images.length + selectedImages.length > 5) {
        toast.error("You can only upload a maximum of 5 images.");
        return;
      }

      const validImages = selectedImages.filter((file) =>
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      );

      if (validImages.length !== selectedImages.length) {
        toast.error("Only JPG and PNG images are allowed.");
      }

      formik.setFieldValue("images", [...formik.values.images, ...validImages]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = formik.values.files.filter((_, i) => i !== index);
    formik.setFieldValue("files", newFiles);
  };

  const removeImage = (index: number) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue("images", newImages);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h3 className="text-lg font-bold text-gray-900">
          Submit Work for:{" "}
          <span className="text-purple-600">{task.title || "Task"}</span>
        </h3>
        <p className="text-sm text-gray-500">
          Upload your documents, images, and add a note for your mentor.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Message / Notes
          </label>
          <textarea
            name="message"
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Type your message here..."
            className="w-full h-32 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Document Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Documents
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-purple-200 transition-colors h-32"
            >
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-2">
                <BiFile size={20} />
              </div>
              <p className="text-xs font-medium text-gray-600">
                Click to upload docs
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                PDF, Word, Excel, PowerPoint
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              className="hidden"
            />
            {/* File Previews */}
            {formik.values.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {formik.values.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100 text-sm"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <BiFile className="text-blue-500 shrink-0" />
                      <span className="truncate max-w-37.5 text-gray-700 font-medium">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <BiX size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Images (JPG/PNG only, Max 5)
            </label>
            <div
              onClick={() => {
                if (formik.values.images.length < 5)
                  imageInputRef.current?.click();
              }}
              className={`border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-colors h-32 ${
                formik.values.images.length >= 5
                  ? "opacity-50 cursor-not-allowed bg-gray-50"
                  : "cursor-pointer hover:bg-gray-50 hover:border-purple-200"
              }`}
            >
              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-2">
                <BiImage size={20} />
              </div>
              <p className="text-xs font-medium text-gray-600">
                {formik.values.images.length >= 5
                  ? "Limit Reached"
                  : "Click to upload images"}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">
                {formik.values.images.length}/5 images selected
              </p>
            </div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageChange}
              multiple
              accept=".jpg,.jpeg,.png"
              className="hidden"
              disabled={formik.values.images.length >= 5}
            />
            {formik.values.images.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {formik.values.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0.5 right-0.5 bg-black/50 hover:bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <BiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-50">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {formik.isSubmitting ? (
              <>
                <BiLoaderAlt className="animate-spin" size={18} />
                Submitting...
              </>
            ) : (
              <>
                <BiPaperPlane size={18} />
                Submit Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
