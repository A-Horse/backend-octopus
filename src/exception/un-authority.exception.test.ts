import { UnAuthority, instanceofNoAuthError } from './un-authority.exception';

test('instanceofNoAuthError', () => {
  const error = new UnAuthority();
  expect(instanceofNoAuthError(error)).toBeTruthy();

  const error2 = new Error();
  expect(instanceofNoAuthError(error2)).toBeFalsy();
});
