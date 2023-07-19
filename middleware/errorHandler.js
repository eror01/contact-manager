const { constants } = require('../constants');

const createErrorResponse = (title, message, stackTrace) => {
  return {
    title,
    message,
    stackTrace
  };
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  let errorResponse;

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      errorResponse = createErrorResponse("Validation failed", err.message, err.stack);
      break;
    case constants.NOT_FOUND:
      errorResponse = createErrorResponse("Not Found", err.message, err.stack);
      break;
    case constants.UNAUTHORIZED:
      errorResponse = createErrorResponse("Unauthorized", err.message, err.stack);
      break;
    case constants.FORBIDDEN:
      errorResponse = createErrorResponse("Forbidden", err.message, err.stack);
      break;
    case constants.SERVER_ERROR:
      errorResponse = createErrorResponse("Server Error", err.message, err.stack);
      break;
    default:
      console.log('No Error, All good!');
      break;
  }

  if (errorResponse) {
    res.json(errorResponse);
  }
};

module.exports = errorHandler;