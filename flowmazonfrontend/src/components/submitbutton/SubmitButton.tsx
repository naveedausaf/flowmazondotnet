import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ label }: { label: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pending } = useFormStatus();
  console.log(
    `In SubmitButton component function: aria-disabled  is: ${String(pending)}`,
  );
  return (
    <button
      type='submit'
      onClick={(e) => {
        console.log('Submit button clicked. Handler YET to be called');
        if (pending) {
          e.preventDefault();
        }
      }}
      className={clsx(
        'btn btn-primary btn-block mt-4',
        pending && 'btn-disabled',
      )}
      aria-disabled={pending}
    >
      <div
        className={clsx(
          { position: 'relative' },
          pending && 'loading loading-spinner loading-lg',
        )}
      >
        {label}
      </div>
    </button>
  );
}
