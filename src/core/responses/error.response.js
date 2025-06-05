const StatusCode = {
    BAD_REQUEST: 400,
    NOT_UPDATE:405,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  const ReasonStatusCode = {
    BAD_REQUEST: "Bad Request Error",
    UNAUTHORIZED: "Unauthorized Error",
    FORBIDDEN: "Forbidden Error",
    NOT_FOUND: "Not Found Error",
    CONFLICT: "Conflict Error",
    INTERNAL_SERVER_ERROR: "Internal Server Error",
    NOT_UPDATE:"Cannot update this field!"
  };
  
  class ErrorResponse extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }
  }
  
  class BadRequestError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.BAD_REQUEST,
      status = StatusCode.BAD_REQUEST
    ) {
      super(message, status);
    }
  }
  class NotUpdateError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.NOT_UPDATE,
      status = StatusCode.NOT_UPDATE
    ) {
      super(message, status);
    }
  }
  class UnauthorizedRequestError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.UNAUTHORIZED,
      status = StatusCode.UNAUTHORIZED
    ) {
      super(message, status);
    }
  }
  class NotFoundRequestError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.NOT_FOUND,
      status = StatusCode.NOT_FOUND
    ) {
      super(message, status);
    }
  }
  
  class ForbiddenRequestError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.FORBIDDEN,
      status = StatusCode.FORBIDDEN
    ) {
      super(message, status);
    }
  }
  class ConflictRequestError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.CONFLICT,
      status = StatusCode.CONFLICT
    ) {
      super(message, status);
    }
  }
  
  class InternalServerError extends ErrorResponse {
    constructor(
      message = ReasonStatusCode.INTERNAL_SERVER_ERROR,
      status = StatusCode.INTERNAL_SERVER_ERROR
    ) {
      super(message, status);
    }
  }
  
  module.exports = {
    UnauthorizedRequestError,
    NotFoundRequestError,
    ConflictRequestError,
    ForbiddenRequestError,
    BadRequestError,
    InternalServerError,
    NotUpdateError
  };
  