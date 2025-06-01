import clsx from 'clsx';
import { useFormStatus } from 'react-dom';

export default function SubmitButton({ label }: { label: string }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      onClick={(e) => {
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
