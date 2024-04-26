import { useFormik, FormikConfig, FormikValues, FormikProps } from "formik";
import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import clsx from "clsx";

//TODO: Few more things to do:

//2. Document the hook: it is just  as a decorator for the specific
//behaviour of computing an error on a field based on whether it has
//been changed and subsequently exited or if there was an
//in the field when we last tried to submit (whether or not
//we had exited or changed the field). These computed errors
//would be made available as an additional "hasError" property.
//
//3. Factor out repeated blocks of label, control, error message
//into components
function useFormikAccessible<Values extends FormikValues>(
  config: FormikConfig<Values>,
): FormikProps<Values> & {
  hasError: { [InputControl in keyof Values]: boolean };
} {
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

  const handleChange = (
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

  const handleBlur = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
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
    ...formik,
    handleSubmit,
    handleChange,
    handleBlur,
    hasError,
  };
}

export default function AddProductPage() {
  const formikExt = useFormikAccessible({
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
        <form action="" onSubmit={formikExt.handleSubmit}>
          <label htmlFor="name">Name</label>

          <input
            type="text"
            className={clsx(
              formikExt.hasError.name &&
                "focus:ring-error focus:border-error border-error",

              "input input-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            aria-required="true"
            aria-invalid={formikExt.hasError.name}
            aria-describedby="nameError"
            {...formikExt.getFieldProps("name")}
          />
          <div className="mb-2 mt-0">
            <span
              id="nameError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {formikExt.hasError.name && formikExt.errors.name}
            </span>
            &nbsp;
          </div>
          <label htmlFor="description">Description</label>
          <textarea
            className={clsx(
              formikExt.hasError.description &&
                "focus:ring-error focus:border-error border-error",

              "textarea textarea-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            aria-required="true"
            aria-invalid={formikExt.hasError.description}
            aria-describedby="descriptionError"
            {...formikExt.getFieldProps("description")}
          />
          <div className="mb-2 mt-0">
            <span
              id="descriptionError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {formikExt.hasError.description && formikExt.errors.description}
            </span>
            &nbsp;
          </div>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            className={clsx(
              formikExt.hasError.imageUrl &&
                "focus:ring-error focus:border-error border-error",

              "input input-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            aria-required="true"
            aria-invalid={formikExt.hasError.imageUrl}
            aria-describedby="imageUrlError"
            {...formikExt.getFieldProps("imageUrl")}
          />
          <div className="mb-2 mt-0">
            <span
              id="imageUrlError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {formikExt.hasError.imageUrl && formikExt.errors.imageUrl}
            </span>
            &nbsp;
          </div>
          <label htmlFor="price">Price</label>
          <input
            type="text"
            className={clsx(
              formikExt.hasError.price &&
                "focus:ring-error focus:border-error border-error",

              "input input-bordered mb-0 w-full focus:outline-none focus:ring-1",
            )}
            aria-required="true"
            aria-invalid={formikExt.hasError.price}
            aria-describedby="priceError"
            {...formikExt.getFieldProps("price")}
          />
          <div className="mb-2 mt-0">
            <span
              id="priceError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {formikExt.hasError.price && formikExt.errors.price}
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
