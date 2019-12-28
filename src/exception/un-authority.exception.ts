export class UnAuthority extends Error {
  constructor(message = 'UnAuthority') {
    super(message);
    Object.setPrototypeOf(this, UnAuthority.prototype);
  }
}

export function instanceofNoAuthError(error: Error): boolean {
  return error instanceof UnAuthority;
}