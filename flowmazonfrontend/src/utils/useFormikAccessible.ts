import { useFormik, FormikConfig, FormikValues, FormikProps } from "formik";

import { FormEvent, useEffect, useState } from "react";
import * as Yup from "yup";

//TODO: Document the hook: it is just  as a decorator for the specific
//behaviour of computing an error on a field based on whether it has
//been changed and subsequently exited or if there was an
//in the field when we last tried to submit (whether or not
//we had exited or changed the field). These computed errors
//would be made available as an additional "hasError" property.

export default function useFormikAccessible<Values extends FormikValues>(
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
