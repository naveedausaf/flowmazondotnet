/**
 * Primitive for intertask signalling that can be
 * in one of three states: Initial, Flipped and Flopped.
 *
 * Protocol for use is as follows:
 *
 * 1. A signallee waits for flip by calling `await flipFlop.waitForFlip()`.
 *
 * 2. At some point, a signaller calls `flipFlop.flip()`. After that, OPTIONALLY, it can also wait for flop by calling `await flipFlop.waitForFlop()`.
 *
 * 3. At some point, the signallee would be resumed by the JavaScript event loop from the point after `await flipFlop.waitForFlip()`. OPTIONALLY it can indicate that it has resumed by calling `flipFlop.resumeAfterFlip()` in the very next line after the `await` statement. This indication may be useful for it to later compute when or if it can call `flipFlop.flop()`.
 *
 * 4. At some point, typically when it is finished, the signallee would call `flipFlop.flop()`.
 *
 * 5. If the signaller had been waiting for the flop, then at some point in the future it would be resumed by the event loop from the statement after the `await flipFlop.waitForFlop()`.
 */
export type FlipFlop = {
  flip(): void;
  waitForFlip(): Promise<void>;
  flop(): void;
  waitForFlop(): Promise<void>;
  resumeAfterFlip(): void;
  didResumeAfterFlip(): boolean;
};

/**
 *
 * @returns This creates a FlipFlop object that can be used to signal between two tasks within the same [agent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model#agent_execution_model) i.e. they share an event loop. In practice this means that both the signaller and signally are within the window's event loop or both within the same Web Worker.
 *
 * An example is where this FlipFlop would be really useful is when you want to synchronise between a UI test, e.g. play function in Storybook written using Testing Library, and a UI component under tests such as a React component. Both of these are running in the same agent, i.e. the window's event loop.
 *
 * Reason why this works within the same event loop is because when either the signaller or signallee await a flip or a flop, the bit of executing code up until the await has been compiled into a [microtask](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide) that has run to completion.
 *
 * This means at some point the other party that calls the flip or the flop would be scheduled as a task (on the job queue, e.g. if the call to flip or flop is contained within the uninterrupted task corresponding to an event handler) or a microtask (if the call to flip or flop is contained within a bit of code that runs subsequent to the completion of a Promise or `await` statement). In either case, the other party would be scheduled to run after the current task or microtask has completed and would call the flip or the flop. It can then await for the recpirocal signal (which would a flop if it had called flip, or flip if it is a new signallee). At this point its own execution would end as a microtask. It would then be scheduled for execution when the event it has been waiting for - internally a Promise waiting to be resolved - has taken place because the party it has been waiting on was able to run.
 *
 * This wouldn't work when the signaller and signallee are in different agents and tehrefore in different event loops. BEcause in this case, in order to guarantee that after one party starts `await`ing a flip or a flop the other would run at some point to do that flip or flop, we need to use inter-agent communciation using [`postMesssage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) and `onmessage` event handler at a minimum but possibly also using [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) class for inter-thread/inter-agent synchronizaation.
 */
export const createSameAgentFlipFlop = (): FlipFlop => {
  let flipPromiseResolver: () => void;
  let flopPromiseResolver: () => void;

  const flipPromise = new Promise<void>((resolve) => {
    flipPromiseResolver = resolve;
  });
  const flopPromise = new Promise<void>((resolve) => {
    flopPromiseResolver = resolve;
  });

  let didResumeAfterFlip = false;

  console.log('creating and returning a new flipflip from createFlipFlop()');

  const id = Math.random().toString(36).substring(2, 15);
  return {
    flip: () => {
      flipPromiseResolver();
      console.log(`Flipped. from flipFlop ${id}`);
    },
    waitForFlip: async () => {
      await flipPromise;
      console.log(`Completed waiting for flip. from flipFlop ${id}`);
    },
    flop: () => {
      flopPromiseResolver();
      console.log(`Flopped. from flipFlop ${id}`);
    },
    waitForFlop: async () => {
      console.log(`Waiting for flop. from flipFlop ${id}`);
      await flopPromise;
      console.log(`Completed waiting for flop. from flipFlop ${id}`);
    },
    resumeAfterFlip: () => {
      didResumeAfterFlip = true;
      console.log(
        `Code that was waiting on flip has resumed after flip. didResumeAfterFlip: ${String(didResumeAfterFlip)}. from flipFlop ${id}`,
      );
    },
    didResumeAfterFlip: () => {
      console.log(
        `returning didResumeAfterFlip ${String(didResumeAfterFlip)} from flipFlop ${id}`,
      );
      return didResumeAfterFlip;
    },
  };
};
