
export function takeImageBase64DataContent(base64) {
  return base64.replace(/^data:image\/\w+;base64,/, '');
}
