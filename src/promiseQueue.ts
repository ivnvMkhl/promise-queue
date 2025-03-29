export class PromiseQueue {
  readonly #tasks: Array<() => Promise<unknown>> = [];
  #runningCount = 0;
  readonly #checkAbortTimeout = 10;
  public readonly concurrency: number;

  constructor({ concurrency }: { concurrency: number }) {
    if (concurrency <= 0) {
      throw new Error("concurrency do not less 1");
    }
    this.concurrency = concurrency;
  }

  readonly #handleAbortCheck =
    (signal: AbortSignal, reject: () => void) => () => {
      if (signal.aborted) {
        reject();
      } else {
        setTimeout(
          this.#handleAbortCheck(signal, reject),
          this.#checkAbortTimeout,
        );
      }
    };

  readonly #startNextTask = () => {
    while (this.#runningCount < this.concurrency && this.#tasks.length) {
      this.#runningCount++;
      const task = this.#tasks.shift();
      if (task) {
        task().finally(() => {
          this.#runningCount--;
          this.#startNextTask();
        });
      }
    }
  };

  public readonly enqueue = <T>(
    task: () => Promise<T>,
    signal?: AbortSignal,
  ): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      if (signal) {
        setTimeout(
          this.#handleAbortCheck(signal, reject),
          this.#checkAbortTimeout,
        );
      }
      this.#tasks.push(() => task().then(resolve).catch(reject));
      this.#startNextTask();
    });
  };
}
