import { useFormik } from "formik";
import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import clsx from "clsx";

export default function AddProductPage() {
  const formik = useFormik({
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

  function inputValues<T>(
    name: T,
    description: T,
    price: T,
    imageUrl: T,
  ): { [InputName in keyof typeof formik.initialValues]-?: T } {
    return {
      name,
      description,
      price,
      imageUrl,
    };
  }

  let inputsChangedDefaults: {
    [InputName in keyof typeof formik.initialValues]-?: boolean;
  } = inputValues(false, false, false, false);

  const [inputsChanged, setInputsChanged] = useState(inputsChangedDefaults);

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
    inputValues(false, false, false, false),
  );

  function assertInputIsValidated(
    inputName: string,
  ): asserts inputName is keyof typeof formik.initialValues {
    if (!(inputName in formik.initialValues))
      throw new TypeError(
        `Form control ${inputName} is not known to be a validated control.`,
      );
  }

  const handleInputBlurred = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    console.log("BLUR handler called.");
    formik.handleBlur(e);
    assertInputIsValidated(e.currentTarget.name);
    setInputsChangedThenBlurred({
      ...inputsChangedThenBlurred,
      [e.currentTarget.name]: inputsChanged[e.currentTarget.name], //&& we know it has just blurred,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("SUBMIT handler called.");
    formik.handleSubmit(e);

    setInputsChangedThenBlurred(inputValues(true, true, true, true));
  };

  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div>
        <h1 className="mb-4 text-lg font-bold">Add Product</h1>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="name" className="text-lg">
            Name
          </label>

          <input
            type="text"
            className="input input-bordered mb-0 w-full"
            name="name"
            value={formik.values.name}
            aria-required="true"
            onChange={handleInputChanged}
            onBlur={handleInputBlurred}
            aria-invalid={
              (formik.errors.name && inputsChangedThenBlurred.name) || false
            }
            aria-describedby="nameError"
          />
          <div className="mb-2 mt-0">
            <span
              id="nameError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {inputsChangedThenBlurred.name && formik.errors.name}
            </span>
            &nbsp;
          </div>
          <label htmlFor="description" className="text-lg">
            Description
          </label>
          <textarea
            name="description"
            className="textarea textarea-bordered mb-0 w-full"
            value={formik.values.description}
            aria-required="true"
            onChange={handleInputChanged}
            onBlur={handleInputBlurred}
            aria-invalid={
              !!formik.errors.description &&
              inputsChangedThenBlurred.description
            }
            aria-describedby="descriptionError"
          />
          <div className="mb-2 mt-0">
            <span
              id="descriptionError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {inputsChangedThenBlurred.description &&
                formik.errors.description}
            </span>
            &nbsp;
          </div>
          <label htmlFor="imageUrl" className="text-lg">
            Image URL
          </label>
          <input
            type="text"
            className="input input-bordered mb-0 w-full"
            name="imageUrl"
            value={formik.values.imageUrl}
            aria-required="true"
            onChange={handleInputChanged}
            onBlur={handleInputBlurred}
            aria-invalid={
              !!formik.errors.imageUrl && inputsChangedThenBlurred.imageUrl
            }
            aria-describedby="imageUrlError"
          />
          <div className="mb-2 mt-0">
            <span
              id="imageUrlError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {inputsChangedThenBlurred.imageUrl && formik.errors.imageUrl}
            </span>
            &nbsp;
          </div>
          <label htmlFor="price" className="text-lg">
            Price
          </label>
          <input
            type="text"
            className="input input-bordered mb-0 w-full"
            name="price"
            value={formik.values.price}
            aria-required="true"
            onChange={handleInputChanged}
            onBlur={handleInputBlurred}
            aria-invalid={
              !!formik.errors.price && inputsChangedThenBlurred.price
            }
            aria-describedby="priceError"
          />
          <div className="mb-2 mt-0">
            <span
              id="priceError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {inputsChangedThenBlurred.price && formik.errors.price}
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
