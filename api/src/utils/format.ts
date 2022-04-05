export class Format {
  public static formatSeconds(s: number) {
    const hours = Math.floor(s / (60 * 60));
    const minutes = Math.floor((s % (60 * 60)) / 60);
    const seconds = Math.floor(s % 60);

    let toReturn = '';

    if (!!hours) {
      toReturn += hours + "h ";
    }
    if (!!minutes) {
      toReturn += minutes + "m ";
    }
    if (!!seconds) {
      toReturn += seconds + "s";
    }
    return toReturn;
  }
}
