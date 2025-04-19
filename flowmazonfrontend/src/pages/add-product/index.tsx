/* eslint-disable @typescript-eslint/no-unused-vars */
import Head from 'next/head';
import * as Yup from 'yup';
/* import { useRouter } from 'next/router'; */
import clsx from 'clsx';
import useFormikAccessible from '@/utils/useFormikAccessible';
import { config } from '@/utils/config';

export const validationSchema = Yup.object({
  name: Yup.string()
    .max(50, 'Name must be 50 characters or less')
    .required('Name is required'),
  description: Yup.string()
    .required('Description is required.')
    .max(10000, 'Description must be 10,000 characters or less'),
  imageUrl: Yup.string()
    .url('Image URL must be a valid URL.')
    .required('Image URL is required.')
    .max(1000, 'Image URL must be 1000 character or less'),
  price: Yup.number()
    //even though we have a custom test for money below
    //whose pattern will fail for non numeric input,
    //the fact that the input is not a number will fail
    //first and the default eror message will be shown:
    //"price must be a `number` type, but the final value was: `NaN`"
    //THerefore we have to ahain the .typeError below
    //to provide a more appropriate message if the input is
    //not a number:
    .typeError('Price must be a number')
    .required('Price is required.') //does not appear in .tests so needs
    //special treatment in tests cases
    .min(0, 'Price must be zero or greater.')
    .max(50000)
    //TODO: Note: other than than the two instances of
    //of difficulty in reflecting on the schema pointed out in
    //the stories file, this is anotner reason why I would
    //switch away fro Yup: no build in constraint for
    //money!!!
    .test(
      'currency',
      'Price must have two or fewer digits after the decimal point',
      (num) => /^[1-9]\d{0,6}(\.((\d\d)|\d))?$/.test(String(num)),
    ),
});

//TODO: Factor out repeated blocks of label, control, error message
//into components
export default function AddProductPage() {
  console.log(validationSchema.describe().fields.price);

  const form = useFormikAccessible({
    initialValues: {
      name: '',
      description: '',
      imageUrl: '',
      price: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await fetch(config.serviceUrls.product, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
    },
  });

  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-4 text-lg font-bold'>Add Product</h1>
        <form action='' onSubmit={form.handleSubmit}>
          <label htmlFor='name'>Name</label>

          <input
            type='text'
            className={clsx(
              form.hasError.name &&
                'border-error focus:border-error focus:ring-error',

              'input input-bordered mb-0 w-full focus:ring-1 focus:outline-hidden',
            )}
            name='name'
            value={form.values.name}
            aria-required='true'
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.name}
            aria-describedby='nameError'
          />
          <div className='mt-0 mb-2'>
            <span
              id='nameError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {form.hasError.name && form.errors.name}
            </span>
            &nbsp;
          </div>
          <label htmlFor='description'>Description</label>
          <textarea
            name='description'
            className={clsx(
              form.hasError.description &&
                'border-error focus:border-error focus:ring-error',

              'textarea textarea-bordered mb-0 w-full focus:ring-1 focus:outline-hidden',
            )}
            value={form.values.description}
            aria-required='true'
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.description}
            aria-describedby='descriptionError'
          />
          <div className='mt-0 mb-2'>
            <span
              id='descriptionError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {form.hasError.description && form.errors.description}
            </span>
            &nbsp;
          </div>
          <label htmlFor='imageUrl'>Image URL</label>
          <input
            type='text'
            className={clsx(
              form.hasError.imageUrl &&
                'border-error focus:border-error focus:ring-error',

              'input input-bordered mb-0 w-full focus:ring-1 focus:outline-hidden',
            )}
            name='imageUrl'
            value={form.values.imageUrl}
            aria-required='true'
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.imageUrl}
            aria-describedby='imageUrlError'
          />
          <div className='mt-0 mb-2'>
            <span
              id='imageUrlError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {form.hasError.imageUrl && form.errors.imageUrl}
            </span>
            &nbsp;
          </div>
          <label htmlFor='price'>Price</label>
          <input
            type='text'
            className={clsx(
              form.hasError.price &&
                'border-error focus:border-error focus:ring-error',

              'input input-bordered mb-0 w-full focus:ring-1 focus:outline-hidden',
            )}
            name='price'
            value={form.values.price}
            aria-required='true'
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.price}
            aria-describedby='priceError'
          />
          <div className='mt-0 mb-2'>
            <span
              id='priceError'
              aria-live='assertive'
              className='text-sm text-red-500'
            >
              {form.hasError.price && form.errors.price}
            </span>
            &nbsp;
          </div>
          <button type='submit' className='btn btn-secondary btn-block mt-4'>
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
