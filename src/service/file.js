import md5 from 'blueimp-md5';
import R from 'ramda';

export function hashFileName(content) {
  const hash = md5(content + Date.now()).substring(0, 20);
  return R.compose(R.join('-'), R.splitEvery(5))(hash);
}
