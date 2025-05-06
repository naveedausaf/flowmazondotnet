/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useFormik, FormikConfig, FormikValues, FormikProps } from 'formik';

import { FormEvent, useEffect, useState } from 'react';
import * as Yup from 'yup';

//TODO: Document the hook: it is just  as a decorator for the specific
//behaviour of computing an error on a field based on whether it has
//been changed and subsequently exited or if there was an
//in the field when we last tried to submit (whether or not
//we had exited or changed the field). These computed errors
//would be made available as an additional "hasError" property.

export default function useForm<Values extends FormikValues>(
  config: FormikConfig<Values>,
): FormikProps<Values> & {
  hasError: { [InputControl in keyof Values]: boolean };
  isFirstInputWithError: { [InputControl in keyof Values]: boolean };
  required: { [InputControl in keyof Values]: boolean };
} {
  const formik = useFormik(config);

  function createObjectWithKeyForEachControlAndSameValueForAllKeys<T>(
    sameValueForEachKey: T,
  ): {
    [InputName in keyof typeof formik.initialValues]: T;
  } {
    // //HAIRY FUNCTION...KEEP A TAB ON TYPE ASSERTIONS

    const keys: (keyof typeof formik.initialValues)[] = Object.keys(
      formik.initialValues,
    );
    return Object.fromEntries(
      keys.map((key) => [key, sameValueForEachKey]),
    ) as {
      [InputName in keyof typeof formik.initialValues]: T;
    };
  }

  //names of validated inputs. These would be used below in computing
  //and returning several objects that indicate state, with respect
  //to validation, of the corresponding controls on the form.
  const namesOfValidatedInputs: (keyof typeof formik.initialValues)[] =
    Object.keys(formik.initialValues);

  //this object indicates which of the inputs is reqruied
  //this could be used to set `aria-required="true"` on the
  //correpsonding form controls
  const required =
    createObjectWithKeyForEachControlAndSameValueForAllKeys(false);
  namesOfValidatedInputs.forEach((controlName) => {
    /*eslint-disable @typescript-eslint/no-unsafe-member-access */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const fieldSchema = config.validationSchema.fields[controlName].describe();
    /*eslint-disable @typescript-eslint/no-unsafe-member-access */
    required[controlName] = !fieldSchema.optional && !fieldSchema.nullable;
  });

  // The two state variable given directly below keep track of inputs
  // that have changed at least once and have subsequently been exited
  // (i.e. blurred). This makes it ok to show their error state
  // (if any).
  //
  // State changes to these vriables are performed by the three custom
  // handleChange, handleBlur and handleSubmit functions shown below
  // which also call `formik` object's handleChange, handlerBlur and
  // handleSubmit respectively.
  //
  // The setting of the state variable(s) would trigger a re-render
  // of the component that calls this hook (by calling `useForm` near
  // the top of its render function).
  //
  // During that re-render, new value of `hasError` object would be
  // computed based (directly or indirectly on the values of the two
  // state variables. `hasError` would indicate which inputs
  // it is ok to shown in an error state (i.e. with error message
  // visible and/or the control itself having a red vorder etc.)
  // becuase:
  //
  // a) formik determined based on its validation that they have
  // errors AND,
  // b) they have already been modified then exited (i.e. blurred)
  // at least once, which it ok to indicate their errors visually (e.g.
  // show the error message element and colour the border red etc.)
  //
  // This newly computed value of `hasForm` would be returned as part
  // of the object returned by the `useForm` hook. The form control
  // that is re-rendering can use it to show visible errors on controls
  // for which `hasError[<input name>]` is true.
  const [
    inputsThatHaveChangedAtLeastOnce,
    setInputsThatHaveChangedAtLeastOnce,
  ] = useState(createObjectWithKeyForEachControlAndSameValueForAllKeys(false));

  const [inputsThatChangedThenBlurred, setInputsThatChangedThenBlurred] =
    useState(createObjectWithKeyForEachControlAndSameValueForAllKeys(false));

  const handleChange = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    formik.handleChange(e);
    setInputsThatHaveChangedAtLeastOnce({
      ...inputsThatHaveChangedAtLeastOnce,
      [e.currentTarget.name]: true, //cheating a bit as this
      //falls outside TS type checking
    });
  };

  const handleBlur = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    formik.handleBlur(e);
    setInputsThatChangedThenBlurred({
      ...inputsThatChangedThenBlurred,
      [e.currentTarget.name]:
        /* ( */ inputsThatHaveChangedAtLeastOnce[
          e.currentTarget.name
        ] /*&& we know it has just blurred)*/ ||
        // Following allows us to take into account value
        // that would have been set if user tried to
        // submit the form before
        inputsThatChangedThenBlurred[e.currentTarget.name],
    });
  };

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    formik.handleSubmit(e);

    //set all inputs to changed then blurred
    setInputsThatChangedThenBlurred(
      createObjectWithKeyForEachControlAndSameValueForAllKeys(true),
    );
  };

  const isFirstInputWithError =
    createObjectWithKeyForEachControlAndSameValueForAllKeys(false);
  let foundInputWithError = false;

  const hasError =
    createObjectWithKeyForEachControlAndSameValueForAllKeys(false);
  namesOfValidatedInputs.forEach((controlName) => {
    hasError[controlName] =
      inputsThatChangedThenBlurred[controlName] && !!formik.errors[controlName];
    if (!foundInputWithError && hasError[controlName]) {
      foundInputWithError = true; //so we will not enter this block again
      //in subsequent iterations of the forEach

      isFirstInputWithError[controlName] = true;
    }
  });

  return {
    ...formik,
    handleSubmit,
    handleChange,
    handleBlur,
    hasError,
    isFirstInputWithError,
    required,
  };
}
