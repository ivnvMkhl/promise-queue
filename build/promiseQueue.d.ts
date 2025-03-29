export declare class PromiseQueue {
    #private;
    readonly concurrency: number;
    constructor({ concurrency }: {
        concurrency: number;
    });
    readonly enqueue: <T>(task: () => Promise<T>, signal?: AbortSignal) => Promise<T>;
}
