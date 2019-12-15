import { NoAuthError, instanceofNoAuthError } from "./no-auth.error"

test('instanceofNoAuthError', () => {
    const error = new NoAuthError();
    expect(instanceofNoAuthError(error)).toBeTruthy();

    const error2 = new Error();
    expect(instanceofNoAuthError(error2)).toBeFalsy();

});