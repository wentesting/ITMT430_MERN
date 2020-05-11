const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLogIn(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.accessCode = !isEmpty(data.accessCode) ? data.accessCode : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.accessCode)) {
    errors.accessCode = "Access Code field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
