import {
  AccessLimitException,
  instanceofAccessLimitException
} from './access-limit.exception';
test('AccessLimitException', () => {
  const error = new AccessLimitException();
  expect(instanceofAccessLimitException(error)).toBeTruthy();

  const error2 = new Error();
  expect(instanceofAccessLimitException(error2)).toBeFalsy();
});
