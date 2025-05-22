/**
 * Interface to be used by signaller code which sets and, if needed, resets the signal, and can optionally wait until after the signalled has resumed.
 *
 * It is one of two parts of an IntertaskSignal object.
 */
export type SignallerInterface = {
  set: () => void;
  reset: () => void;
  waitForSignalledCodeToHaveResumed: () => Promise<void>;
};

/**
 * Interface to be used by the signalled code (the _signallee_) that waits to be signalled and then, once it resumes after signal has been set, indicates that it has resumed.
 *
 * It is one of two parts of an IntertaskSignal object.
 */
export type SignalWatcherInterface = {
  completed(): unknown;
  didResumeAfterWaitingForSignal(): unknown;
  waitForSignal: () => Promise<void>;
  resumeAfterWaitingForSignal: () => void;
};

export type IntertaskSignal = {
  signaller: SignallerInterface;
  signalWatcher: SignalWatcherInterface;
};

/**
 *
 * **Signalled** code, this could be a Promise that runs at a diferent time from **signaller**) waits to be signalled to continue by doing `await signal.waitForSignal()`. The signaller code - this could be an event handler invoked by the browser or a Promise that has been scheduled for execution - at some point says `signal.set()` to indicate that the waiting code can continue.
 *
 * Note the returned object CANNOT be used to synchronise between pieces of code running on different agents. For that an implementation taht uses `postMessage` and `message` event handler to communciate across agent boundaries (e.g. between UI thread and a Web Worker, or between two Web Workers) would be requried.
 *
 * When the task - e.g. the event handler invoked by the  browser or the Promise, the latter is more accurately called a [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) - that set the signal ends, and the event loop eventually picks up the continuation of the code - the microtask/Promise that consists of code that comes after the `await signal.waitForSignal()` statement - from the queue to execute, that code can indicate that it has resumed after waiting for the signal by calling `signal.resumeAfterWaitingForSignal()`. This can be helpful of the signalling code subsequently called `await signal.waitThatSignalledCodeHasResumed()` as any code after that `await` would only run after signalled code has called `signal.resumeAfterWaitingForSignal()`.
 *
 * Once (and if) the signalled code has called `signal.resumeAfterWaitingForSignal()` it would run to completion (As is true for any running task/microtask under the JavaSCript execution model). Then, at some point the event loop would pick up the task that consists of the bit of signalling code after `await signal.waitThatSignalledCodeHasResumed()` and run it.
 *
 * The overall effect is that first  the signalled code waits for the signal, then runs to completion. Note that this point of completion could (or would? I am not entierly sure if `await` on a Promise always compiles to a `then`, in which case "would" is the word I am looking for, or if the promise is already resolved then the bit after `await` woulc run immediately and synchronously, in which case the word is "could") be reached at the next `await` statement in the signalled code. At some point, signalling code says `signal.set()` and continues to run to completion. After calling `signal.set()`, the signalling code (same task or one of its continuations chained using `then()` or `await`) may also call `signal.waitThatSignalledCodeHasResumed()`, in which case its completion point would be reached and a continuation (microtask) would be created that would be resolved and therefore scheduled for execution on the microtask queue when the signalled code calls `signal.resumeAfterWaitingForSignal()`. Then, once the signalled task has run to completion, at some point, this microtask in signalling code would be picked up and executed, at which point the bit in the signalling code after `await signal.waitThatSignalledCodeHasResumed()` would be start running.
 *
 *
 * @returns Creates a signal that can be used to synchronise
 * execution of a signaller with signalled code when both pieces of code are running on the same thread (more accurately, on the same [_agent_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#agent_execution_model) in JavaScript).
 */
export default function createSameAgentSignal(): IntertaskSignal {
  console.log('In createSignal...creating a new signal');
  let signalPromiseResolver: () => void;
  let signalledCodeResumedPromiseResolver: () => void;
  let resumedAfterWaitingForSignal = false;
  let signalPromise: Promise<void>;
  let signalledCodeResumedPromise: Promise<void>;
  const reset = () => {
    signalPromise = new Promise<void>((resolve) => {
      signalPromiseResolver = resolve;
    });
    signalledCodeResumedPromise = new Promise<void>((resolve) => {
      signalledCodeResumedPromiseResolver = resolve;
    });
  };
  //set signal object's constituent parts to initial position
  //for the very first time
  reset();

  //now return the signal object
  return {
    signaller: {
      set: () => {
        signalPromiseResolver();
        console.log('Signal set');
      },
      reset,
      waitForSignalledCodeToHaveResumed: async () => {
        await signalledCodeResumedPromise;
        console.log('signalled code has completed...');
      },
    },
    signalWatcher: {
      //do not want to return the `promise` directly,
      //superstition on my part
      waitForSignal: async () => {
        await signalPromise;
      },
      resumeAfterWaitingForSignal: () => {
        console.log(
          'Code that was waiting for signal has resumed after the signal was set',
        );
        signalledCodeResumedPromiseResolver();
        resumedAfterWaitingForSignal = true;
      },
      completed: function (): unknown {
        throw new Error('Function not implemented.');
      },
      didResumeAfterWaitingForSignal: function (): boolean {
        return resumedAfterWaitingForSignal;
      },
    },
  };
}
