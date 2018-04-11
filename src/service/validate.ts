import * as validator from 'validator';
import validatorPatch from './validate-patch';
import * as R from 'ramda';
import { ErrorParamsError } from './error';

validatorPatch(validator)

export function validateRequest(carrier, filed, rules) {
  const value = carrier[filed];
  R.unless(rules => rules.every(rule => {
    const [ruleFnName, params] = R.splitAt(1, rule.split(':'));
    return validator[ruleFnName].apply(null, params).call(null, value);
  }), () => {throw new ErrorParamsError('error params')})(rules);
}
