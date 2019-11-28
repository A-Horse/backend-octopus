import * as _ from 'lodash';
import * as R from 'ramda';
import * as validator from 'validator';

import { ErrorParamsError } from '../../service/error';
import validatorPatch from '../../service/validate-patch';

export function validate(validatedRule) {
  return (req, res, next) => {
    R.map(key => {
      const value = _.get(key);
      const rules = validatedRule[key];
      R.unless(
        rules =>
          rules.every(rule => {
            const [ruleFnName, params] = R.splitAt(1, rule.split(':'));
            return validator[ruleFnName].apply(null, params).call(null, value);
          }),
        () => {
          throw new ErrorParamsError('params error');
        }
      )(rules);
    })(Object.keys(validatedRule));
    next();
  };
}
