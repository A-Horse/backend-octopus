export class ErrorParamsError extends Error {
  constructor(message = 'error params') {
    super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
  }
}


export class NotFoundError extends Error {
  constructor(message = 'resource not found') {
    super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class DuplicateError extends Error {
  constructor(message = 'duplicate') {
    super(message);
    // Object.setPrototypeOf(this, new.target.prototype);
  }
}
