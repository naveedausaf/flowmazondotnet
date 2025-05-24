/* eslint-disable @typescript-eslint/no-unused-vars */
import Head from 'next/head';
import * as Yup from 'yup';
/* import { useRouter } from 'next/router'; */
import clsx from 'clsx';
import useForm from '@/utils/useForm';
import { config } from '@/utils/config';
import AddProductScreen from '@/screens/add-product/AddProductScreen';
import AlertDialog from '@/components/alertdialog/AlertDialog';
import { useState } from 'react';

export const serverErrorTitle = 'Server Error';
export const serverErrorMessage =
  'An error occurred while processing your request. Please try again.';

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
    //whose pattern would fail for any non numeric input,
    //if the the input is not a number, then .number() constaint
    // will fail first and the default eror message will be shown:
    //
    //"price must be a `number` type, but the final value was: `NaN`"
    //
    //Therefore we have to ahain the .typeError below
    //to provide a more appropriate message if the input is
    //not a number:
    .typeError('Price must be a number')
    .required('Price is required.') //does not appear in .tests so needs
    //special treatment in tests cases
    .min(0, 'Price must be zero or greater.')
    .max(50000)
    //TODO: Note: other than than the two instances of
    //of difficulty in reflecting on the schema pointed out in
    //the stories file, this is another reason why I would
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
  const [serverErrorOccurred, setServerErrorOccurred] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      imageUrl: '',
      price: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(config.serviceUrls.product, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
      } catch (error) {
        //TODO: log the error
        //TODO: make sure the page doesn't
        //navigate to the next page despite form
        //submission error
        setServerErrorOccurred(true);
      }
    },
  });

  return (
    <>
      <AlertDialog
        title={serverErrorTitle}
        description={serverErrorMessage}
        open={serverErrorOccurred}
        onClose={() => {
          setServerErrorOccurred(false);
        }}
      />
      <AddProductScreen
        hasError={form.hasError}
        required={form.required}
        ids={form.id}
        errors={form.errors}
        values={form.values}
        onBlur={form.handleBlur}
        onChange={form.handleChange}
        onSubmit={form.submitForm}
      />
    </>
  );
}
