import { expect, test } from "vitest";
import { PromiseQueue } from "./promiseQueue";
import { TestService } from "./test.service";

const { waitingTask, getRandomSequence } = TestService;

type TaskTimestampsMap = Record<
  string,
  Record<string, [number, number, number]>
>;

test("create valid instance", () => {
  expect(() => {
    return new PromiseQueue({ concurrency: 1 }) instanceof PromiseQueue;
  }).toBeTruthy();
});

test("validate concurrency public field", () => {
  Array.from({ length: 100 }, (_, index) => index + 1).forEach((concurrency) =>
    expect(() => {
      return new PromiseQueue({ concurrency }).concurrency === concurrency;
    }).toBeTruthy(),
  );
});

test("create instance less 1 concurrency", () => {
  Array.from({ length: 100 }, (_, index) => 0 - index).forEach((concurrency) =>
    expect(
      () => new PromiseQueue({ concurrency }),
      `create instance on ${concurrency} concurrecy`,
    ).toThrowError(),
  );
});

const queueTimeTest = async (
  concurrency: number,
  taskCount: number,
  timeoutRange: [number, number],
) => {
  const queue = new PromiseQueue({ concurrency });
  const timeouts = getRandomSequence(taskCount, timeoutRange);
  const taskTimestampsMap: TaskTimestampsMap = {};
  const tasksPromises = timeouts.map((timeout, index) =>
    queue.enqueue(waitingTask(timeout)).then(({ start, end }) => {
      const groupCount = Math.floor(index / concurrency);
      const groupIndex = index % concurrency;
      if (taskTimestampsMap[groupCount]) {
        taskTimestampsMap[groupCount][groupIndex] = [
          Math.round(start),
          Math.round(end),
          timeout,
        ];
      } else {
        taskTimestampsMap[groupCount] = {
          [groupIndex]: [Math.round(start), Math.round(end), timeout],
        };
      }
    }),
  );

  await Promise.all(tasksPromises);

  if (Object.keys(taskTimestampsMap).length > 1) {
    const firstTaskStart = Math.min(
      ...Object.values(taskTimestampsMap[0]).map(([start]) => start),
    );
    const lastTaskEnd = Math.max(
      ...Object.values(
        taskTimestampsMap[Object.keys(taskTimestampsMap).length - 1],
      ).map(([, end]) => end),
    );
    const allTimeTasks =
      timeouts.reduce((acc, timeout) => acc + timeout, 0) / concurrency;
    expect(
      Math.ceil(lastTaskEnd - firstTaskStart),
      "lastTaskEnd - firstTaskStart",
    ).toBeGreaterThanOrEqual(allTimeTasks);
  } else {
    throw new Error("Do not queue");
  }
};

(
  [
    [1, 25, [10, 50]],
    [2, 50, [10, 50]],
    [5, 150, [10, 50]],
    [10, 250, [10, 50]],
    [20, 500, [10, 50]],
  ] as [number, number, [number, number]][]
).forEach(([concurrency, taskCount, timeoutRange]) => {
  test(`test queue time
        concurrency: ${concurrency}
        taskCount: ${taskCount}
        timeoutRange: ${timeoutRange}`, () =>
    queueTimeTest(concurrency, taskCount, timeoutRange));
});
