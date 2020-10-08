const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateSellerInput(data) {
  let errors = {};
  // console.log("Inside Validation\n Data:", data);

  data.userName = !isEmpty(data.userName) ? data.userName : "";
  data.cNIC = !isEmpty(data.cNIC) ? data.cNIC : "";
  data.description = !isEmpty(data.description) ? data.description : "";
  data.language = !isEmpty(data.language) ? data.language : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.location = !isEmpty(data.location) ? data.location : "";
  data.age = !isEmpty(data.age) ? data.age : "";

  if (!Validator.isLength(data.userName, { min: 2, max: 40 })) {
    errors.userName = "UserName needs to be between 2 to 40 characters";
  }
  if (Validator.isEmpty(data.userName)) {
    errors.userName = "UserName is required";
  }
  if (!Validator.isLength(data.cNIC, { min: 13, max: 14 })) {
    errors.cNIC = "cNIC needs to be 13 digits";
  }
  if (Validator.isEmpty(data.cNIC)) {
    errors.cNIC = "cNIC is required";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description is required";
  }
  if (Validator.isEmpty(data.language)) {
    errors.language = "Language field is required";
  }
  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Skill field is required";
  }
  if (!Validator.isLength(data.phone, { min: 11, max: 15 })) {
    errors.phone = "Phone no. needs to be between 11 to 14 characters";
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = "Phone no. is required";
  }
  if (Validator.isEmpty(data.location)) {
    errors.location = "Location field is required";
  }
  if (!Validator.isLength(data.age, { min: 1, max: 4 })) {
    errors.age = "age needs to be between 1 to 3 characters";
  }
  if (Validator.isEmpty(data.age)) {
    errors.age = "age is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors),
  };
};
