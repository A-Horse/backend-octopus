// function ExtendableBuiltin(cls) {
//   function ExtendableBuiltin() {
//     cls.apply(this, arguments);
//   }
//   ExtendableBuiltin.prototype = Object.create(cls.prototype);
//   Object.setPrototypeOf(ExtendableBuiltin, cls);
//   return ExtendableBuiltin;
// }

export class ErrorParamsError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class AccessLimitError extends Error {
  constructor(message = 'access limit error') {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'resource not found') {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class DuplicateError extends Error {
  constructor(message = 'duplicate') {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}
