import { EntityNotFoundException, instanceofEntityNotFoundException } from './entity-not-found.exception';

test('EntityNotFoundException', () => {
  const error = new EntityNotFoundException();
  expect(instanceofEntityNotFoundException(error)).toBeTruthy();

  const error2 = new Error();
  expect(instanceofEntityNotFoundException(error2)).toBeFalsy();
});
