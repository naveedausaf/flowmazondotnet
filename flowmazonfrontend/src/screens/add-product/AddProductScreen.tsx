import Head from 'next/head';
import clsx from 'clsx';
import { FormEvent, useId } from 'react';
import SubmitButton from '@/components/submitbutton/SubmitButton';

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

  ids: {
    name: string;
    description: string;
    imageUrl: string;
    price: string;
  };

  onSubmit: (formData: FormData) => Promise<void>;

  onBlur: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  onChange: (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export default function AddProductScreen({
  hasError,
  errors,
  values,
  required,
  ids,
  onSubmit,
  onBlur,
  onChange,
}: AddProductPageScreenProps) {
  const nameErrorId = useId();
  const descErrorId = useId();
  const imageUrlErrorId = useId();
  const priceErrorId = useId();

  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div className='bg-base-100 sm:px-1 sm:py-5 md:px-3 md:py-4 lg:px-3 lg:py-4'>
        <div className='mx-auto max-w-5xl px-0'>
          <h1 className='mb-4 text-lg font-bold'>Add Product</h1>
          <form action={onSubmit} aria-label='add product form'>
            <label htmlFor={ids.name}>Name</label>
            <input
              type='text'
              className={clsx(
                hasError.name &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='name'
              id={ids.name}
              value={values.name}
              inputMode='text'
              autoComplete='name'
              aria-required={required.name}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.name}
              aria-describedby={(hasError.name && nameErrorId) || ''}
              aria-live='assertive'
            />
            <div className='mt-0 mb-2'>
              <span id={nameErrorId} className='0 text-error text-sm'>
                {hasError.name && errors.name}
              </span>
              &nbsp;
            </div>
            <label htmlFor={ids.description}>Description</label>
            <textarea
              name='description'
              id={ids.description}
              className={clsx(
                hasError.description &&
                  'border-error focus:border-error focus:ring-error',

                'textarea textarea-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              value={values.description}
              inputMode='text'
              autoComplete='off'
              aria-required={required.description}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.description}
              aria-describedby={descErrorId}
            />
            <div className='mt-0 mb-2'>
              <span id={descErrorId} className='text-error text-sm'>
                {hasError.description && errors.description}
              </span>
              &nbsp;
            </div>
            <label htmlFor={ids.imageUrl}>Image URL</label>
            <input
              type='text'
              className={clsx(
                hasError.imageUrl &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='imageUrl'
              id={ids.imageUrl}
              value={values.imageUrl}
              inputMode='url'
              autoComplete='url'
              aria-required={required.imageUrl}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.imageUrl}
              aria-describedby={imageUrlErrorId}
            />
            <div className='mt-0 mb-2'>
              <span id={imageUrlErrorId} className='text-error text-sm'>
                {hasError.imageUrl && errors.imageUrl}
              </span>
              &nbsp;
            </div>
            <label htmlFor={ids.price}>Price</label>
            <input
              type='text'
              className={clsx(
                hasError.price &&
                  'border-error focus:border-error focus:ring-error',

                'input input-bordered mb-0 w-full focus:ring-1 focus:outline-none',
              )}
              name='price'
              id={ids.price}
              value={values.price}
              inputMode='decimal'
              autoComplete='off'
              aria-required={required.price}
              onChange={onChange}
              onBlur={onBlur}
              aria-invalid={hasError.price}
              aria-describedby={priceErrorId}
            />
            <div className='mt-0 mb-2'>
              <span id={priceErrorId} className='text-error text-sm'>
                {hasError.price && errors.price}
              </span>
              &nbsp;
            </div>
            <SubmitButton label='Add Product' />
          </form>
        </div>
      </div>
    </>
  );
}
