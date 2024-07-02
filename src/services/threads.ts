import range from 'lodash/range';

const $transferable = Symbol('thread.transferable');
const $worker = Symbol('thread.worker');

function isTransferable(thing) {
  return thing && typeof thing === 'object';
}

export function expose(moduleObj) {
  addEventListener('message', async (e) => {
    const { args, module, taskId } = e.data;

    if (!moduleObj[module]) {
      return postMessage({ taskId, error: `Module ${module} is not available` });
    }

    const moduleResult = moduleObj[module](...args);

    if (moduleResult[$transferable]) {
      postMessage({ taskId, payload: moduleResult.payload }, moduleResult.transferables);
    } else {
      postMessage({ taskId, payload: moduleResult });
    }
  });
}

export class WebWorker {
  _nextTaskId = 0;
  worker: Worker | null = null;
  busy = false;
  onTaskDone: () => void = () => { };

  constructor(workerFactory) {
    this.worker = workerFactory();
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  nextTaskId() {
    return this._nextTaskId++;
  }
}

export class Thread {
  static terminate(thread) {
    thread[$worker].terminate();
  }

  constructor(workerFactory) {
    this[$worker] = new WebWorker(workerFactory);

    return new Proxy(this, {
      get: (target, name) => {
        if (name === $worker) {
          return this[$worker];
        }

        return (...args) => {
          const transferables = args.flatMap(arg => (typeof arg === 'object' && arg[$transferable] ? arg.transferables : []));

          const taskId = this[$worker].nextTaskId();

          return new Promise((resolve, reject) => {
            const eventHandler = (e) => {
              if (e.data.taskId !== taskId) return;

              if (e.data.error) {
                return reject(e.data.error);
              }

              this[$worker].worker.removeEventListener('message', eventHandler);
              this[$worker].busy = false;
              resolve(e.data.payload);
              this[$worker].onTaskDone();
            };
            this[$worker].worker.addEventListener('message', eventHandler);
            this[$worker].worker.postMessage({ module: name, taskId, args }, transferables);
            this[$worker].busy = true;
          });
        };
      }
    });
  }
}

export class Pool {
  threads: Thread[] = [];
  _tasks: [Function, Function][] = [];
  _onCompleteResolvers: Function[] = [];

  constructor(workerFactory, size = 4) {
    this.threads = range(size).map(() => new Thread(workerFactory));

    this.threads.forEach(thread => {
      (thread[$worker] as WebWorker).onTaskDone = this._onTaskDone.bind(this);
    });
  }

  _idleThread() {
    return this.threads.find(thread => !(thread[$worker] as WebWorker).busy);
  }

  async _onTaskDone() {
    const idleThread = this._idleThread();

    if (this._tasks.length && idleThread) {
      const task = this._tasks.shift();
      if (task) {
        const [taskExecutor, resolve] = task;
        const taskResult = await taskExecutor(idleThread);

        return resolve(taskResult);
      }
    }

    this._onCompleteResolvers.forEach(onCompleteResolver => onCompleteResolver());
    this._onCompleteResolvers = [];
  }

  queue(taskExecutor) {
    const idleThread = this._idleThread();

    if (idleThread) {
      return taskExecutor(idleThread);
    }

    return new Promise(resolve => {
      this._tasks.push([taskExecutor, resolve]);
    });
  }

  completed() {
    return new Promise(resolve => {
      this._onCompleteResolvers.push(resolve);
    });
  }

  terminate() {
    this.threads.forEach(thread => Thread.terminate(thread));
  }
}

export function transfer(payload, transferables) {
  if (!transferables) {
    if (!isTransferable(payload)) throw Error();
    transferables = [payload];
  }

  return {
    payload,
    [$transferable]: true,
    transferables,
  };
}