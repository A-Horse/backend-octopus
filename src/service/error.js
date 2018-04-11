'use strict';

function ExtendableBuiltin(cls){
  function ExtendableBuiltin(){
    cls.apply(this, arguments);
  }
  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  Object.setPrototypeOf(ExtendableBuiltin, cls);
  return ExtendableBuiltin;
}

export class ErrorParamsError extends ExtendableBuiltin(Error) {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class AccessLimitError extends ExtendableBuiltin(Error) {
  constructor(message = 'access limit error') {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class NotFoundError extends ExtendableBuiltin(Error) {
  constructor(message = 'resource not found') {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}

export class DuplicateError extends ExtendableBuiltin(Error) {
  constructor(message = 'duplicate') {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
  }
}
