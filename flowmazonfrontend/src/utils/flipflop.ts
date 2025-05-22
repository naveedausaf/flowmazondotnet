export type FlipFlop = {
  flip(): void;
  waitForFlip(): Promise<void>;
  flop(): void;
  waitForFlop(): Promise<void>;
  resumeAfterFlip(): void;
  didResumeAfterFlip(): boolean;
};

export const createFlipFlop = (): FlipFlop => {
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
        `returning didResumeAfterFlip ${didResumeAfterFlip} from flipFlop ${id}`,
      );
      return didResumeAfterFlip;
    },
  };
};
