const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  // Text
  if (!Validator.isLength(data.text, { min: 5, max: 300 })) {
    errors.text = "Post must be between 5 & 300 characters";
  }
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
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
