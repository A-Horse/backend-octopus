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
