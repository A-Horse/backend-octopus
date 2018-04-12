import * as validator from 'validator';
import  validatorPatch from '../../service/validate-patch';
import * as R from 'ramda';
import { ErrorParamsError } from '../../service/error';
import * as _ from 'lodash';

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
          throw new ErrorParamsError();
        }
      )(rules);
    })(Object.keys(validatedRule));
    next();
  };
}
