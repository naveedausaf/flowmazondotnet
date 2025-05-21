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
      className='btn btn-primary btn-block mt-4'
    >
      {label}
    </button>
  );
}
