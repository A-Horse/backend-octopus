export class EntityNotFoundException extends Error {
  constructor(message = 'entity not found exception') {
    super(message);
    Object.setPrototypeOf(this, EntityNotFoundException.prototype);
  }
}

export function instanceofEntityNotFoundException(error: Error): boolean {
  return error instanceof EntityNotFoundException;
}
