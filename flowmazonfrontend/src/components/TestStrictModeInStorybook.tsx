import React, { useState, useEffect, useId } from 'react';

export default function TestEffect() {
  console.log('RENDER function started');
  const [counter, setCounter] = useState(0);
  const inputId = useId();

  useEffect(() => {
    console.log('EFFECT started...');
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!inputElement) {
      throw new Error(`Element with id ${inputId} not found`);
    }
    inputElement.value = counter.toString();
    console.log('EFFECT finished...');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  console.log('RENDER function finished; About to return JSX...');
  return (
    <div>
      <span>Counter: </span>
      <input type='text' id={inputId} className='rounded-md border-2' />
      <button
        onClick={() => {
          setCounter((prev) => prev + 1);
        }}
        className='btn btn-primary btn-block mt-4'
      >
        Increment counter
      </button>
    </div>
  );
}
