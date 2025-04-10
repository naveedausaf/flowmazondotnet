import Head from 'next/head';
import clsx from 'clsx';
import { FormEvent } from 'react';

export type FormState = {
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

  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;

  handleBlur: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  handleChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AddProductPageScreen(formState: FormState) {
  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div>
        <h1 className='mb-4 text-lg font-bold'>Add Product</h1>
        <form action='' onSubmit={formState.handleSubmit}>
          <label htmlFor='name'>Name</label>

          <input
            type='text'
            className={clsx(
              formState.hasError.name &&
                'border-error focus:border-error focus:ring-error',

              'input input-bordered mb-0 w-full focus:outline-none focus:ring-1',
            )}
            name='name'
            value={formState.values.name}
            aria-required='true'
            onChange={formState.handleChange}
            onBlur={formState.handleBlur}
            aria-invalid={formState.hasError.name}
            aria-describedby='nameError'
          />
          <div className='mb-2 mt-0'>
            <span
              id='nameError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {formState.hasError.name && formState.errors.name}
            </span>
            &nbsp;
          </div>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            className={clsx(
              formState.hasError.description &&
                'border-error focus:border-error focus:ring-error',

              'textarea textarea-bordered mb-0 w-full focus:outline-none focus:ring-1',
            )}
            value={formState.values.description}
            aria-required='true'
            onChange={formState.handleChange}
            onBlur={formState.handleBlur}
            aria-invalid={formState.hasError.description}
            aria-describedby='descriptionError'
          />
          <div className='mb-2 mt-0'>
            <span
              id='descriptionError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {formState.hasError.description && formState.errors.description}
            </span>
            &nbsp;
          </div>
          <label htmlFor='imageUrl'>Image URL</label>
          <input
            type='text'
            className={clsx(
              formState.hasError.imageUrl &&
                'border-error focus:border-error focus:ring-error',

              'input input-bordered mb-0 w-full focus:outline-none focus:ring-1',
            )}
            name='imageUrl'
            value={formState.values.imageUrl}
            aria-required='true'
            onChange={formState.handleChange}
            onBlur={formState.handleBlur}
            aria-invalid={formState.hasError.imageUrl}
            aria-describedby='imageUrlError'
          />
          <div className='mb-2 mt-0'>
            <span
              id='imageUrlError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {formState.hasError.imageUrl && formState.errors.imageUrl}
            </span>
            &nbsp;
          </div>
          <label htmlFor='price'>Price</label>
          <input
            type='text'
            className={clsx(
              formState.hasError.price &&
                'border-error focus:border-error focus:ring-error',

              'input input-bordered mb-0 w-full focus:outline-none focus:ring-1',
            )}
            name='price'
            value={formState.values.price}
            aria-required='true'
            onChange={formState.handleChange}
            onBlur={formState.handleBlur}
            aria-invalid={formState.hasError.price}
            aria-describedby='priceError'
          />
          <div className='mb-2 mt-0'>
            <span
              id='priceError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {formState.hasError.price && formState.errors.price}
            </span>
            &nbsp;
          </div>
          <button type='submit' className='btn btn-primary btn-block mt-4'>
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
