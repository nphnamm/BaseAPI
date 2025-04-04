export class CustomError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class ValidationError extends CustomError {
  constructor(message: string = 'Validation Error') {
    super(422, message);
  }
} 