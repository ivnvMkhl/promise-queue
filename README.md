## Install

```sh
npm i @mkhl_ivnv/promise-queue
```

## Import

Use the ESM imports

```TypeScript
import { PromiseQueue } from "@mkhl_ivnv/promise-queue";
```

## Usage

Create new instance of PromiseQueue and be shure specify concurrency on constructor `>= 1`

```TypeScript
import { PromiseQueue } from "@mkhl_ivnv/promise-queue";

const queue = new PromiseQueue({ concurrency: 1 });
```

Use the public method `enqueue` to add new task on queue. This method returned new promise that includes queue waiting time and task execution time.

```TypeScript
import { PromiseQueue } from "@mkhl_ivnv/promise-queue";

const queue = new PromiseQueue({ concurrency: 1 });

const task = () => fetch('https://fetch.example');
const taskOnQueue = queue.enqueue(task);

taskOnQueue.then((fetchResponse) => fetchResponce.json());
```

You can use [AbortController](https://developer.mozilla.org/ru/docs/Web/API/AbortController) to reject task promise.

```TypeScript
import { PromiseQueue } from "@mkhl_ivnv/promise-queue";

const queue = new PromiseQueue({ concurrency: 1 });
const abortController = new AbortController();
const { signal, abort } = abortController;

const task = () => fetch('https://fetch.example', {signal});
const taskOnQueue = queue.enqueue(task, signal);

abort();

taskOnQueue.then((fetchResponse) => fetchResponce.json());
```
