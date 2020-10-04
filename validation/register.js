const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.fname = !isEmpty(data.fname) ? data.fname : "";
  data.lname = !isEmpty(data.lname) ? data.lname : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";
  data.gender = !isEmpty(data.gender) ? data.gender : "";

  // First Name
  if (!Validator.isLength(data.fname, { min: 2, max: 30 })) {
    errors.fname = "First Name must be between 2 & 30 characters";
  }
  if (Validator.isEmpty(data.fname)) {
    errors.fname = "First Name field is required";
  }

  // Last Name
  if (!Validator.isLength(data.lname, { min: 2, max: 30 })) {
    errors.lname = "Last Name must be between 2 & 30 characters";
  }
  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Last Name field is required";
  }

  // Email
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  // Password
  if (!Validator.isLength(data.password, { min: 3, max: 20 })) {
    errors.password = "Password must be between 3 & 20 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // Confirm Password
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  // Gender
  if (Validator.isEmpty(data.gender)) {
    errors.gender = "Gender field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
