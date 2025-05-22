import { useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import SubmitButton from './SubmitButton';
import { FlipFlop } from '@/utils/flipflop';

export type SubmitButtonPropsAndCustomArgs = React.ComponentProps<
  typeof SubmitButton
> & {
  submitHandlerEnteredCount: number;
  flipFlop: FlipFlop;
};

export default function FlopInEffectIfFormStatusNoLongerPending({
  test1Args,
}: {
  test1Args: SubmitButtonPropsAndCustomArgs;
}) {
  const { pending } = useFormStatus();
  console.log(
    `In FlopInEffectIfFormStatusNoLongerPending component function. pending is: ${String(pending)}`,
  );
  useEffect(() => {
    console.log(
      `in effect...flipFlop.didResumeAfterFlip(): ${String(test1Args.flipFlop.didResumeAfterFlip())}  pending: ${String(pending)}`,
    );

    if (test1Args.flipFlop.didResumeAfterFlip() && !pending) {
      console.log('in effect, flopping the flipFlop');
      test1Args.flipFlop.flop();
    }
  });
  return <span> h</span>;
}
