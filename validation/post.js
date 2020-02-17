const Validator = require("validator");
const isEmpty = require("./is-empty");
const { typy } = require("typy");

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
  const star = data && data.rates ? data.rates.star : null;

  // Rate
  if (!Validator.isLength(star, { min: 1, max: 5 })) {
    errors.rate = "Rating must be between 1 & 5 stars";
  }
  if (Validator.isEmpty(star)) {
    errors.rate = "Rating field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
