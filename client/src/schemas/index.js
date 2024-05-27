import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().required("Required"),
});

export const signupSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  username: yup
    .string()
    .matches(/^[a-zA-Z0-9_]*$/, "Username can only contain letters, digits, and underscores")
    .min(3, "Usrename must contain at least 3 characters")
    .max(15, "Username can't have more than 15 characters")
    .required("Required"),
  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least 1 small letter")
    .matches(/\d/, "Password must contain at least 1 digit")
    .required("Required"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match")
    .required("Required"),
});

export const userInfoSchema = yup.object().shape({
  country: yup
  .string(),
  email: yup.string().email("Invalid email"),

  oldPassword: yup.string(),
  password: yup
    .string()
    .min(6, "Password must contain at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least 1 small letter")
    .matches(/\d/, "Password must contain at least 1 digit"),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match")
});

export const emailSchema = yup.object().shape({
  email:  yup.string().email("Invalid email").required("Required")
})

export const passwordSchema = yup.object().shape({
  password:  yup.string().required("Required")
})

export const restorePasswordSchema = yup.object().shape({
  password: yup
  .string()
  .min(6, "Password must contain at least 6 characters")
  .matches(/[a-z]/, "Password must contain at least 1 small letter")
  .matches(/\d/, "Password must contain at least 1 digit")
  .required("Required"),
passwordConfirmation: yup
  .string()
  .oneOf([yup.ref("password"), null], "Passwords don't match")
  .required("Required")
})

export const addFundsSchema = yup.object().shape({
  amount: yup.number()
    .required("Required")
    .positive("Amount must be positive"),
  cardNumber: yup.string()
    .required("Required")
    .matches(/^([245]\d{3} \d{4} \d{4} \d{4})$/,
    "Card number must be 16 digits and start with either 2, 4, or 5"),
  expiryDate: yup.string()
    .required("Required")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in format MM/YY"),
  cvv: yup
    .string()
    .matches(/^\d{3}$/, "CVV must be exactly 3 digits")
    .required("Required"),
});