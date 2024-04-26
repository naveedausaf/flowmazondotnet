import { useFormik, FormikConfig, FormikValues } from "formik";
import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import clsx from "clsx";

//TODO: Few more things to do:
//1. Reduce clutter of wiring up in each control using
//getFieldProps: https://formik.org/docs/tutorial#getfieldprops
//
//2. implement hook as a decorator for the specific behaviour
//of computing an error on a field based on whether it has
//been changed and subsequently exited or if there was an
//in the field when we last tried to submit (whether or not
//we had exited or changed the field). These computed errors
//would be made available as an additional "hasError" property.
//
//3. Factor out repeated blocks of label, control, error message
//into components

function useFormikAccessible<FV extends FormikValues>(
  config: FormikConfig<FV>,
) {
  const formik = useFormik(config);

  function sameValueAgainstEachValidatedControl<T>(value: T): {
    [InputName in keyof typeof formik.initialValues]: T;
  } {
    // //HAIRY FUNCTION...KEEP NOTE OF TYPE ASSERTIONS

    const keys: (keyof typeof formik.initialValues)[] = Object.keys(
      formik.initialValues,
    );
    return Object.fromEntries(keys.map((key) => [key, value])) as {
      [InputName in keyof typeof formik.initialValues]: T;
    };
  }

  const [inputsChanged, setInputsChanged] = useState(
    sameValueAgainstEachValidatedControl(false),
  );

  const handleInputChanged = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log("CHANGE handler called.");
    formik.handleChange(e);
    setInputsChanged({
      ...inputsChanged,
      [e.currentTarget.name]: true, //cheating a bit as this
      //falls outside TS type checking
    });
  };

  const [inputsChangedThenBlurred, setInputsChangedThenBlurred] = useState(
    sameValueAgainstEachValidatedControl(false),
  );

  const handleInputBlurred = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log("BLUR handler called.");
    formik.handleBlur(e);
    setInputsChangedThenBlurred({
      ...inputsChangedThenBlurred,
      [e.currentTarget.name]:
        /* ( */ inputsChanged[
          e.currentTarget.name
        ] /*&& we know it has just blurred)*/ ||
        //Following allows us to take into account value set
        //if user tried to submit form before
        inputsChangedThenBlurred[e.currentTarget.name],
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("SUBMIT handler called.");
    formik.handleSubmit(e);

    setInputsChangedThenBlurred(sameValueAgainstEachValidatedControl(true));
  };

  const namesOfValidatedControl: (keyof typeof formik.initialValues)[] =
    Object.keys(formik.initialValues);
  const hasError = sameValueAgainstEachValidatedControl(false);
  namesOfValidatedControl.forEach((controlName) => {
    hasError[controlName] =
      inputsChangedThenBlurred[controlName] && !!formik.errors[controlName];
  });
  return {
    formik,
    handleSubmit,
    handleInputChanged,
    handleInputBlurred,
    hasError,
  };
}

export default function AddProductPage() {
  const form = useFormikAccessible({
    initialValues: {
      name: "",
      description: "",
      imageUrl: "",
      price: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Name must be 50 characteres or less")
        .required("Name is required."),
      description: Yup.string().required("Description is required."),
      imageUrl: Yup.string()
        .url("Image URL must be a valid URL.")
        .required("Image URL is required."),
      price: Yup.number()
        .required("Price is required.")
        .min(0, "Price must be zero or greater.")
        .integer("Price must be an integer."),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div>
        <h1 className="mb-4 text-lg font-bold">Add Product</h1>
        <form action="" onSubmit={form.handleSubmit}>
          <label htmlFor="name">Name</label>

          <input
            type="text"
            className={clsx(
              form.hasError.name &&
                "focus:ring-error focus:border-error border-error",

              "input input-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            name="name"
            value={form.formik.values.name}
            aria-required="true"
            onChange={form.handleInputChanged}
            onBlur={form.handleInputBlurred}
            aria-invalid={form.hasError.name}
            aria-describedby="nameError"
          />
          <div className="mb-2 mt-0">
            <span
              id="nameError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.name && form.formik.errors.name}
            </span>
            &nbsp;
          </div>
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            className={clsx(
              form.hasError.description &&
                "focus:ring-error focus:border-error border-error",

              "textarea textarea-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            value={form.formik.values.description}
            aria-required="true"
            onChange={form.handleInputChanged}
            onBlur={form.handleInputBlurred}
            aria-invalid={form.hasError.description}
            aria-describedby="descriptionError"
          />
          <div className="mb-2 mt-0">
            <span
              id="descriptionError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.description && form.formik.errors.description}
            </span>
            &nbsp;
          </div>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            className={clsx(
              form.hasError.imageUrl &&
                "focus:ring-error focus:border-error border-error",

              "input input-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            name="imageUrl"
            value={form.formik.values.imageUrl}
            aria-required="true"
            onChange={form.handleInputChanged}
            onBlur={form.handleInputBlurred}
            aria-invalid={form.hasError.imageUrl}
            aria-describedby="imageUrlError"
          />
          <div className="mb-2 mt-0">
            <span
              id="imageUrlError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.imageUrl && form.formik.errors.imageUrl}
            </span>
            &nbsp;
          </div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            className={clsx(
              form.hasError.price &&
                "focus:ring-error focus:border-error border-error",

              "input input-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            name="price"
            value={form.formik.values.price}
            aria-required="true"
            onChange={form.handleInputChanged}
            onBlur={form.handleInputBlurred}
            aria-invalid={form.hasError.price}
            aria-describedby="priceError"
          />
          <div className="mb-2 mt-0">
            <span
              id="priceError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.price && form.formik.errors.price}
            </span>
            &nbsp;
          </div>
          <button type="submit" className="btn btn-primary btn-block mt-4">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
