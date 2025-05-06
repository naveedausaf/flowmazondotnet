import Head from 'next/head';
import clsx from 'clsx';
import { FormEvent, useId } from 'react';

export type AddProductPageScreenProps = {
  hasError: {
    name: boolean;
    description: boolean;
    imageUrl: boolean;
    price: boolean;
  };
  errors: {
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: string;
  };
  values: {
    name: string;
    description: string;
    imageUrl: string;
    price: string;
  };
  required: {
    name: boolean;
    description: boolean;
    imageUrl: boolean;
    price: boolean;
  };
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void;

  onBlur: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AddProductScreen({
  hasError,
  errors,
  values,
  required,
  onSubmit,
  onBlur,
  onChange,
}: AddProductPageScreenProps) {
  const nameId = useId();
  const nameErrorId = useId();
  const descId = useId();
  const descErrorId = useId();
  const imageUrlId = useId();
  const imageUrlErrorId = useId();
  const priceId = useId();
  const priceErrorId = useId();

  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div className='bg-base-300 sm:px-1 sm:py-5 md:px-3 md:py-4 lg:px-3 lg:py-4'>
        <div className='mx-auto max-w-5xl px-0'>
          <h1 className='mb-4 text-lg font-bold'>Add Product</h1>
          <form action='' onSubmit={onSubmit} aria-label='add product form'>
            <label htmlFor={nameId}>Name</label>
            <input
              type='text'
              className={clsx(
                hasError.name &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='name'
              id={nameId}
              value={values.name}
              inputMode='text'
              aria-required={required.name}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.name}
              aria-describedby={(hasError.name && nameErrorId) || ''}
              aria-live='assertive'
            />
            <div className='mt-0 mb-2'>
              <span id={nameErrorId} className='0 text-sm text-red-500'>
                {hasError.name && errors.name}
              </span>
              &nbsp;
            </div>
            <label htmlFor={descId}>Description</label>
            <textarea
              name='description'
              id={descId}
              className={clsx(
                hasError.description &&
                  'border-error focus:border-error focus:ring-error',

                'textarea textarea-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              value={values.description}
              inputMode='text'
              aria-required={required.description}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.description}
              aria-describedby={descErrorId}
            />
            <div className='mt-0 mb-2'>
              <span id={descErrorId} className='text-sm text-red-500'>
                {hasError.description && errors.description}
              </span>
              &nbsp;
            </div>
            <label htmlFor={imageUrlId}>Image URL</label>
            <input
              type='text'
              className={clsx(
                hasError.imageUrl &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='imageUrl'
              id={imageUrlId}
              value={values.imageUrl}
              inputMode='url'
              aria-required={required.imageUrl}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.imageUrl}
              aria-describedby={imageUrlErrorId}
            />
            <div className='mt-0 mb-2'>
              <span id={imageUrlErrorId} className='text-sm text-red-500'>
                {hasError.imageUrl && errors.imageUrl}
              </span>
              &nbsp;
            </div>
            <label htmlFor={priceId}>Price</label>
            <input
              type='text'
              className={clsx(
                hasError.price &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='price'
              id={priceId}
              value={values.price}
              inputMode='decimal'
              aria-required={required.price}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.price}
              aria-describedby={priceErrorId}
            />
            <div className='mt-0 mb-2'>
              <span id={priceErrorId} className='text-sm text-red-500'>
                {hasError.price && errors.price}
              </span>
              &nbsp;
            </div>
            <button type='submit' className='btn btn-primary btn-block mt-4'>
              Add Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
