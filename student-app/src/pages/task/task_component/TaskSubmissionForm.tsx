import { useRef } from "react";
import { useFormik } from "formik";
import { BiImage, BiFile, BiX } from "react-icons/bi";
import toast from "react-hot-toast";
import { API } from "../../../contexts/API";
import { getErrorResponse } from "../../../contexts/CallBacks";
import type { UserProps } from "../../../types/UserTypes";
import { ButtonGroup, SecondButton } from "../../../ui/buttons/Button";
import { TextareaGroup } from "../../../ui/form/FormComponents";

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
  statusUpdate?: () => void;
  actionLoading?: boolean;
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
  actionLoading,
  statusUpdate,
}: TaskSubmissionFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Expanded MIME types and Extension list
  const ALLOWED_EXTENSIONS = [
    "pdf", "txt", "doc", "docx", "xls", "xlsx", "ppt", "pptx", 
    "jpg", "jpeg", "png", "webp"
  ];

  const ALLOWED_MIME_TYPES = [
    "application/pdf",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/x-zip-compressed", // Added common extras
    "application/octet-stream"      // Fallback for some browsers
  ];

  const formik = useFormik<FormValues>({
    initialValues: {
      message: "",
      files: [],
      images: [],
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (
        !values.message.trim() &&
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

        values.files.forEach((file) => formData.append("files", file));
        values.images.forEach((image) => formData.append("images", image));

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
      
      const validFiles = selectedFiles.filter((file) => {
        const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
        const isAllowedMime = ALLOWED_MIME_TYPES.includes(file.type);
        const isAllowedExt = ALLOWED_EXTENSIONS.includes(fileExtension);
        
        return isAllowedMime || isAllowedExt;
      });

      if (validFiles.length !== selectedFiles.length) {
        toast.error(
          "Some files were ignored. Use PDF, Images, Office Docs, or TXT.",
        );
      }

      if (validFiles.length > 0) {
        formik.setFieldValue("files", [...formik.values.files, ...validFiles]);
      }
      
      e.target.value = "";
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedImages = Array.from(e.target.files);

      if (formik.values.images.length + selectedImages.length > 5) {
        toast.error(
          "You can only upload a maximum of 5 images in the gallery.",
        );
        return;
      }

      const validImages = selectedImages.filter((file) =>
        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type.toLowerCase())
      );

      if (validImages.length !== selectedImages.length) {
        toast.error("Only JPG, PNG, and WebP are allowed for the gallery.");
      }

      formik.setFieldValue("images", [...formik.values.images, ...validImages]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    const nextFiles = [...formik.values.files];
    nextFiles.splice(index, 1);
    formik.setFieldValue("files", nextFiles);
  };

  const removeImage = (index: number) => {
    const nextImages = [...formik.values.images];
    nextImages.splice(index, 1);
    formik.setFieldValue("images", nextImages);
  };

  return (
    <div className="bg-(--primary-bg) overflow-hidden rounded-custom shadow-custom p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-(--text-color)">
          Submit Work: <span className="text-(--main)">{task.title}</span>
        </h3>
        <SecondButton
          label="Put on Hold"
          className="py-1! px-2! text-xs"
          onClick={statusUpdate}
          disable={actionLoading}
        />
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <TextareaGroup
          rows={5}
          label="Message / Notes"
          id="message"
          placeholder="Describe your progress and deliverables..."
          onChange={formik.handleChange}
          value={formik.values.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="font-black uppercase tracking-widest sub-paragraph">
              Files & Documents
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-(--border) hover:border-(--main) p-4 flex flex-col items-center justify-center cursor-pointer h-32 transition-colors group rounded-custom"
            >
              <BiFile
                size={30}
                className="text-(--main) opacity-60 group-hover:opacity-100"
              />
              <p className="text-xs mt-2 font-bold">PDF, Word, Images, TXT</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="flex flex-col gap-2 mt-2">
              {formik.values.files.map((file, i) => (
                <div
                  key={`file-${i}`}
                  className="flex items-center justify-between p-2 bg-(--main-subtle) text-xs font-bold text-(--main) rounded-custom shadow-custom"
                >
                  <span className="truncate w-40">{file.name}</span>
                  <BiX
                    className="cursor-pointer hover:text-red-500"
                    size={18}
                    onClick={() => removeFile(i)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="font-black uppercase tracking-widest sub-paragraph">
              Image Gallery (Max 5)
            </label>
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-(--border) hover:border-(--main) p-4 flex flex-col items-center justify-center cursor-pointer h-32 transition-colors rounded-custom"
            >
              <BiImage
                size={30}
                className="text-(--main) opacity-60 group-hover:opacity-100"
              />
              <p className="text-xs mt-2 font-bold">
                {formik.values.images.length}/5 Gallery Images
              </p>
            </div>
            <input
              type="file"
              ref={imageInputRef}
              hidden
              accept="image/png, image/jpeg, image/jpg, image/webp"
              multiple
              onChange={handleImageChange}
            />
            <div className="grid grid-cols-5 gap-2 mt-2">
              {formik.values.images.map((img, i) => (
                <div
                  key={`img-${i}`}
                  className="relative aspect-square overflow-hidden shadow-custom rounded-custom"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    className="object-cover w-full h-full"
                    alt="preview"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-0 right-0 bg-(--danger) text-(--white) p-0.5"
                  >
                    <BiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-(--border)">
          <ButtonGroup
            label={formik.isSubmitting ? "Submitting..." : "Submit Task"}
            type="submit"
            disable={formik.isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}