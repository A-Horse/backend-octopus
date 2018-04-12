function required() {
  return val => !!(val + '');
}

function lenLess(len) {
  return val => val.length < len;
}

function lenMore(len) {
  return val => val.length > len;
}

export default function patch(validate) {
  validate.required = required;
  validate.lenLess = lenLess;
  validate.lenMore = lenMore;
}
