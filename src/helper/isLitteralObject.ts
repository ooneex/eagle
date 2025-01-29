export const isLitteralObject = (obj: any): boolean => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  if (obj.constructor !== Object) {
    return false;
  }

  if (Object.getPrototypeOf(obj) !== Object.prototype) {
    return false;
  }

  return true;
};
