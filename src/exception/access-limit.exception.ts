export class AccessLimitException extends Error {
  constructor(message = 'access limit exception') {
    super(message);
    Object.setPrototypeOf(this, AccessLimitException.prototype);
  }
}

export function instanceofAccessLimitException(error: Error): boolean {
  return error instanceof AccessLimitException;
}
