var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _PromiseQueue_tasks, _PromiseQueue_runningCount, _PromiseQueue_checkAbortTimeout, _PromiseQueue_handleAbortCheck, _PromiseQueue_startNextTask;
export class PromiseQueue {
    constructor({ concurrency }) {
        _PromiseQueue_tasks.set(this, []);
        _PromiseQueue_runningCount.set(this, 0);
        _PromiseQueue_checkAbortTimeout.set(this, 10);
        _PromiseQueue_handleAbortCheck.set(this, (signal, reject) => () => {
            if (signal.aborted) {
                reject();
            }
            else {
                setTimeout(__classPrivateFieldGet(this, _PromiseQueue_handleAbortCheck, "f").call(this, signal, reject), __classPrivateFieldGet(this, _PromiseQueue_checkAbortTimeout, "f"));
            }
        });
        _PromiseQueue_startNextTask.set(this, () => {
            var _a;
            while (__classPrivateFieldGet(this, _PromiseQueue_runningCount, "f") < this.concurrency && __classPrivateFieldGet(this, _PromiseQueue_tasks, "f").length) {
                __classPrivateFieldSet(this, _PromiseQueue_runningCount, (_a = __classPrivateFieldGet(this, _PromiseQueue_runningCount, "f"), _a++, _a), "f");
                const task = __classPrivateFieldGet(this, _PromiseQueue_tasks, "f").shift();
                if (task) {
                    task().finally(() => {
                        var _a;
                        __classPrivateFieldSet(this, _PromiseQueue_runningCount, (_a = __classPrivateFieldGet(this, _PromiseQueue_runningCount, "f"), _a--, _a), "f");
                        __classPrivateFieldGet(this, _PromiseQueue_startNextTask, "f").call(this);
                    });
                }
            }
        });
        this.enqueue = (task, signal) => {
            return new Promise((resolve, reject) => {
                if (signal) {
                    setTimeout(__classPrivateFieldGet(this, _PromiseQueue_handleAbortCheck, "f").call(this, signal, reject), __classPrivateFieldGet(this, _PromiseQueue_checkAbortTimeout, "f"));
                }
                __classPrivateFieldGet(this, _PromiseQueue_tasks, "f").push(() => task().then(resolve).catch(reject));
                __classPrivateFieldGet(this, _PromiseQueue_startNextTask, "f").call(this);
            });
        };
        if (concurrency <= 0) {
            throw new Error("concurrency do not less 1");
        }
        this.concurrency = concurrency;
    }
}
_PromiseQueue_tasks = new WeakMap(), _PromiseQueue_runningCount = new WeakMap(), _PromiseQueue_checkAbortTimeout = new WeakMap(), _PromiseQueue_handleAbortCheck = new WeakMap(), _PromiseQueue_startNextTask = new WeakMap();
