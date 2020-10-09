const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.description = !isEmpty(data.description) ? data.description : "";

  // Name
  if (!Validator.isLength(data.name, { min: 5, max:100 })) {
    errors.name = "Post Name must be between 5 & 100 characters";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  // Description
  if (!Validator.isLength(data.description, { min: 5, max: 300 })) {
    errors.description = "Post description must be between 5 & 300 characters";
  }
  if (Validator.isEmpty(data.description)) {
    errors.description = "Description field is required";
  }


  // // Comment
  // if (!Validator.isLength(data.comments.text, { min: 5, max: 300 })) {
  //   errors.comments = "Comment must be between 5 & 300 characters";
  // }
  // if (Validator.isEmpty(data.comments.text)) {
  //   errors.comments = "Comment field is required";
  // }

  // const star = typy(data, "rates.star").safeObject;

  // const star = data && data.rates ? data.rates.star : null;

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
