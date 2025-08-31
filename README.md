# Promise Queue

[![npm version](https://img.shields.io/npm/v/promise-queue.svg)](https://www.npmjs.com/package/@mkhl_ivnv/promise-queue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A promise queue with configurable concurrency for limiting simultaneous task execution.

## Installation

```bash
npm install promise-queue
```

## Basic Usage

```JavaScript
import { PromiseQueue } from "@mkhl_ivnv/promise-queue";

const queue = new PromiseQueue({ concurrency: 1 });

const task = () => fetch('https://fetch.example');
const taskOnQueue = queue.enqueue(task);

taskOnQueue.then((fetchResponse) => fetchResponce.json());
```

## Configuration Options

```JavaScript
const queue = new PromiseQueue({
  concurrency: 3,    // Maximum number of tasks running concurrently (default: 1)
});
```

## API Reference

You can use AbortController to reject task promise.

```JavaScript
import { PromiseQueue } from "@mkhl_ivnv/promise-queue";

const queue = new PromiseQueue({ concurrency: 1 });
const abortController = new AbortController();
const { signal, abort } = abortController;

const task = () => fetch('https://fetch.example', {signal});
const taskOnQueue = queue.enqueue(task, signal);

abort();

taskOnQueue.then((fetchResponse) => fetchResponce.json());
```

