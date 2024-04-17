import { useFormik } from "formik";
import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

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

  const refs = {
    name: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    imageUrl: useRef<HTMLInputElement>(null),
    price: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    let inputRef: keyof typeof refs;
    for (inputRef in refs) {
      refs[inputRef].current!.setCustomValidity(
        formik.touched[inputRef] && formik.errors[inputRef]
          ? formik.errors[inputRef]!
          : "",
      );
    }
  });

  return (
    <>
      <Head>
        <title>Add Product - Flowmazon</title>
      </Head>
      <div>
        <h1 className="mb-3 text-lg font-bold">Add Product</h1>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            className="input input-bordered mb-3 w-full"
            required
            placeholder="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            ref={refs.name}
          />
          <textarea
            required
            name="description"
            placeholder="Description"
            className="textarea textarea-bordered mb-3 w-full"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            ref={refs.description}
          />
          <input
            type="url"
            className="input input-bordered mb-3 w-full"
            required
            placeholder="Image URL"
            name="imageUrl"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            ref={refs.imageUrl}
          />
          <input
            type="number"
            className="input input-bordered mb-3 w-full"
            required
            placeholder="Price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            ref={refs.price}
          />
          <button type="submit" className="btn btn-primary btn-block">
            Add Product
          </button>
        </form>
      </div>
    </>
  );
}
