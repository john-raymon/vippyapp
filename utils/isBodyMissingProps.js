function isBodyMissingProps(requiredProps = [], body) {
  let hasMissingProps = false;

  const propErrors = requiredProps.reduce((errors, prop) => {
    if (body[prop] === undefined || typeof body[prop] === "undefined") {
      hasMissingProps = true;
      errors[prop] = { message: `${prop} is required` };
    }
    return errors;
  }, {});

  return {
    hasMissingProps,
    propErrors
  };
}

module.exports = isBodyMissingProps;
