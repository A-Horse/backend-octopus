export class NoAuthError extends Error {
  constructor(message = 'unauthority') {
    super(message);
    Object.setPrototypeOf(this, NoAuthError.prototype);
  }
}

export function instanceofNoAuthError(error: Error): boolean {
  return error instanceof NoAuthError;
}