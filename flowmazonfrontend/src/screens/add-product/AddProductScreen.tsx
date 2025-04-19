import Head from 'next/head';
import clsx from 'clsx';
import { FormEvent } from 'react';

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
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void;

  onBlur: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AddProductScreen({
  hasError,
  errors,
  values,
  onSubmit,
  onBlur,
  onChange,
}: AddProductPageScreenProps) {
  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div className='bg-base-300 sm:px-1 sm:py-5 md:px-3 md:py-4 lg:px-3 lg:py-4'>
        <div className='mx-auto max-w-5xl px-0'>
          <h1 className='mb-4 text-lg font-bold'>Add Product</h1>
          <form action='' onSubmit={onSubmit}>
            <label htmlFor='name'>Name</label>

            <input
              type='text'
              className={clsx(
                hasError.name &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='name'
              value={values.name}
              aria-required='true'
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.name}
              aria-describedby='nameError'
            />
            <div className='mt-0 mb-2'>
              <span
                id='nameError'
                aria-live='assertive'
                className='text-sm text-red-500'
              >
                {hasError.name && errors.name}
              </span>
              &nbsp;
            </div>
            <label htmlFor='description'>Description</label>
            <textarea
              name='description'
              className={clsx(
                hasError.description &&
                  'border-error focus:border-error focus:ring-error',

                'textarea textarea-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              value={values.description}
              aria-required='true'
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.description}
              aria-describedby='descriptionError'
            />
            <div className='mt-0 mb-2'>
              <span
                id='descriptionError'
                aria-live='assertive'
                className='text-sm text-red-500'
              >
                {hasError.description && errors.description}
              </span>
              &nbsp;
            </div>
            <label htmlFor='imageUrl'>Image URL</label>
            <input
              type='text'
              className={clsx(
                hasError.imageUrl &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='imageUrl'
              value={values.imageUrl}
              aria-required='true'
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.imageUrl}
              aria-describedby='imageUrlError'
            />
            <div className='mt-0 mb-2'>
              <span
                id='imageUrlError'
                aria-live='assertive'
                className='text-sm text-red-500'
              >
                {hasError.imageUrl && errors.imageUrl}
              </span>
              &nbsp;
            </div>
            <label htmlFor='price'>Price</label>
            <input
              type='text'
              className={clsx(
                hasError.price &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='price'
              value={values.price}
              aria-required='true'
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.price}
              aria-describedby='priceError'
            />
            <div className='mt-0 mb-2'>
              <span
                id='priceError'
                aria-live='assertive'
                className='text-sm text-red-500'
              >
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
