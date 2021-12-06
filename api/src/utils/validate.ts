export class Validate {
  public static isNumber(n: any) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0);
  }

  public static isEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
  }

  public static isPhoneNumber(phoneNumber: string) {
    return /(\(?\d{2}\)?\s)?(\d{4,5}-\d{4})/.test(
      String(phoneNumber).toLowerCase()
    );
  }

  public static isDate(date: string) {
    return /[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(String(date).toLowerCase());
  }

  public static isEmpty(data: string) {
    return String(data).trim().length == 0;
  }

  public static isUndefined(data: string) {
    return data === undefined;
  }

  public static isNull(data: string) {
    return !data;
  }

  public static isEqual(arg1: any, arg2: any) {
    return arg1 === arg2;
  }

  public static isValidUri(...values: (string | undefined)[]): boolean {
    let isValid = true;
    const regex =
      /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/g;

    for (const value of values) {
      regex.lastIndex = 0;
      isValid = isValid && value !== undefined && regex.test(value) === true;
      if (!isValid) return false;
    }

    return isValid;
  }
}
