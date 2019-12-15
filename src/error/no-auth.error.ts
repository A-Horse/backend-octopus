export class NoAuthError extends Error {
  constructor(message = 'NO AUTH') {
    super(message);
    
  }
}

export function instanceofNoAuthError(error: Error): boolean {
  return error instanceof NoAuthError;
}