import Head from "next/head";
import * as Yup from "yup";
import { useRouter } from "next/router";
import clsx from "clsx";
import useFormikAccessible from "@/utils/useFormikAccessible";

//TODO: Factor out repeated blocks of label, control, error message
//into components

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
            value={form.values.name}
            aria-required="true"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.name}
            aria-describedby="nameError"
          />
          <div className="mb-2 mt-0">
            <span
              id="nameError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.name && form.errors.name}
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
            value={form.values.description}
            aria-required="true"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.description}
            aria-describedby="descriptionError"
          />
          <div className="mb-2 mt-0">
            <span
              id="descriptionError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.description && form.errors.description}
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
            value={form.values.imageUrl}
            aria-required="true"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.imageUrl}
            aria-describedby="imageUrlError"
          />
          <div className="mb-2 mt-0">
            <span
              id="imageUrlError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.imageUrl && form.errors.imageUrl}
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
            value={form.values.price}
            aria-required="true"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            aria-invalid={form.hasError.price}
            aria-describedby="priceError"
          />
          <div className="mb-2 mt-0">
            <span
              id="priceError"
              aria-live="assertive"
              className="text-sm text-red-500"
            >
              {form.hasError.price && form.errors.price}
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
