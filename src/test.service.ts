export class TestService {
  static readonly getRandomByRange = (max: number, min: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  static readonly waitingTask =
    (timeout: number) =>
    (): Promise<{ start: number; end: number; timeout: number }> =>
      new Promise((resolve) => {
        const start = performance.now();
        setTimeout(() => {
          const end = performance.now();
          resolve({ start, end, timeout });
        }, timeout);
      });

  static readonly getRandomSequence = (
    length: number,
    range: [number, number],
  ) => {
    const [min, max] = range;
    const isValidTimeoutRange = min > max || min < 1 || max < 1;
    if (isValidTimeoutRange) {
      throw new Error("getRandomSequence: range not valid");
    }
    return Array.from({ length }, () => TestService.getRandomByRange(min, max));
  };
}
