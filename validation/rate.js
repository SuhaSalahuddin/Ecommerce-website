const Validator = require("validator");
const isEmpty = require("./is-empty");
const { t } = require("typy");

module.exports = function validateRateInput(data) {
  let errors = {};

  const star = t(data, "rates.star").safeObject;

  data.star = !isEmpty(data.star) ? data.star : "";

  // Rate
  if (!(data.star >= 1 && data.star <= 5)) {
    errors.stars = "Star Rating must be between 1 & 5 stars";
  }
  if (Validator.isEmpty(data.star)) {
    errors.stars = "Star Rating field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
