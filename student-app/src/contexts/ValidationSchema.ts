import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as Yup from "yup";

const getValidString = (field: string, required: boolean = true) => {
  let schema = Yup.string()
    .min(3, `${field} must be at least 3 characters`)
    .max(200, `${field} must be at Max 200 characters`)
    .matches(/^\S.*\S$/, `${field} cannot start or end with a space`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};
const getValidUsername = (field: string, required: boolean = true) => {
  let schema = Yup.string()
    .transform((value) => (value ? value.toLowerCase() : value))
    .matches(
      /^[a-z0-9]+$/,
      `${field} can only contain lowercase letters and numbers`,
    )
    .min(3, `${field} must be at least 3 characters`)
    .matches(/^\S+$/, `${field} cannot contain spaces`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};
const getValidContent = (
  field: string,
  required: boolean = true,
  min: number = 3,
  max: number = 500,
) => {
  let schema = Yup.string()
    .min(min, `${field} must be at least ${min} characters`)
    .max(max, `${field} must be at most ${max} characters`)
    .test(
      "no-leading-trailing-space",
      `${field} cannot start or end with a space`,
      (value) => {
        if (!value) return !required;
        return value.trim().length === value.length;
      },
    );

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const getValidPhone = (field: string, required: boolean = true) => {
  let schema = Yup.string().test("valid-phone", `Invalid ${field}`, (value) => {
    if (!value) return !required;

    const formatted = value.startsWith("+") ? value : `+${value}`;
    const phoneNumber = parsePhoneNumberFromString(formatted);

    return phoneNumber?.isValid() || false;
  });

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const getValidPassword = (field: string, required: boolean = true) => {
  let schema = Yup.string()
    .min(6, `${field} must be at least 6 characters`)
    .matches(/^\S+$/, `${field} cannot contain spaces`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

const getValidConfirmPassword = (
  field: string,
  passwordField: string = "password",
) => {
  return Yup.string()
    .required(`${field} is required`)
    .oneOf([Yup.ref(passwordField)], `${field} must match ${passwordField}`)
    .matches(/^\S+$/, `${field} cannot contain spaces`);
};

const getValidBool = (field: string, required: boolean = true) => {
  let schema = Yup.boolean().typeError(`${field} must be a boolean`);

  if (required) {
    schema = schema.required(`${field} is required`);
  } else {
    schema = schema.optional();
  }

  return schema;
};

export const userEditValidation = Yup.object({
  username: getValidUsername("Username"),
  name: getValidString("Your Name"),
  mobile_no: getValidPhone("Mobile Number"),
  title: getValidString("Title", false),
  about: getValidContent("about", false),
});
export const userLocationEditValidation = Yup.object({
  address: getValidString("Address"),
  pincode: getValidString("Pincode"),
  country: getValidString("Country"),
  state: getValidString("State"),
  city: getValidString("City"),
});

export const userChangePasswordValidation = Yup.object({
  current_password: getValidPassword("Current Password"),
  new_password: getValidPassword("New Password"),
  confirm_password: getValidConfirmPassword("Confirm Password", "new_password"),
});
const getCurrentYearMonth = () => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  };
};

const isAfterCurrentMonth = (year: number, month: number) => {
  const { year: cy, month: cm } = getCurrentYearMonth();
  return year > cy || (year === cy && month > cm);
};

export const userExperienceValidation = Yup.object({
  title: getValidString("title"),

  company: getValidString("Company Name"),

  start_date: Yup.string()
    .required("Start Date is required")
    .test(
      "not-after-current-month",
      "Start date cannot be after current month",
      function (value) {
        if (!value) return true;

        const [y, m] = value.split("-").map(Number);
        if (!y || !m) return true;

        return !isAfterCurrentMonth(y, m);
      },
    ),

  iscurrently: getValidBool("Currently Working", false),

  end_date: Yup.string().when("iscurrently", {
    is: false,
    then: (schema) =>
      schema
        .required("End date is required")
        .test(
          "is-after-start",
          "End date must be after start date",
          function (endVal) {
            const { start_date } = this.parent;

            if (!start_date || !endVal) return true;

            const [sy, sm] = start_date.split("-").map(Number);
            const [ey, em] = endVal.split("-").map(Number);

            if (!sy || !sm || !ey || !em) return true;

            const start = sy * 12 + sm;
            const end = ey * 12 + em;

            return end >= start;
          },
        )
        .test(
          "not-after-current-month",
          "End date cannot be after current month",
          function (value) {
            if (!value) return true;

            const [y, m] = value.split("-").map(Number);
            if (!y || !m) return true;

            return !isAfterCurrentMonth(y, m);
          },
        ),
    otherwise: (schema) => schema.nullable(),
  }),
});

export const userEducationValidation = Yup.object({
  student_class: getValidString("Class"),
  school: getValidString("School Name"),
  pursuing: getValidBool("Currently Pursuing", false),
  academic_year: Yup.string().when("pursuing", {
    is: false,
    then: (schema) => schema.required("Academic Year is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});
