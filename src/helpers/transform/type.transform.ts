import { Transform } from 'class-transformer';

export function ToBoolean() {
  return Transform((v) => ['1', 1, 'true', true].includes(v));
}

export function ToArray() {
  return Transform((value: string) =>
    value.split(',').map((item) => Number(item)),
  );
}

export function ToNumber() {
  return Transform((v) => {
    return +v;
  });
}

export function isTrue(value) {
  if (typeof value === 'string') {
    value = value.trim().toLowerCase();
  }
  switch (value) {
    case true:
    case 'true':
    case 1:
    case '1':
    case 'on':
    case 'yes':
      return true;
    default:
      return false;
  }
}
