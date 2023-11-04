export function identifierValidator(identifier: string) {
  const regex =
    /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$^[a-zA-Z0-9]+$/;
  return regex.test(identifier);
}
