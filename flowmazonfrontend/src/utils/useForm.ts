/* eslint-disable @typescript-eslint/no-unused-vars */
/*eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useFormik, FormikConfig, FormikValues, FormikProps } from 'formik';

import { FormEvent, useEffect, useState, useId, useLayoutEffect } from 'react';
import * as Yup from 'yup';

/**
 * A custom hook that extends Formik's functionality to provide additional
 * state and behavior for form validation and error handling.
 *
 * @template Values - The shape of the form values.
 * @param {FormikConfig<Values>} config - The configuration object for Formik, including
 * initial values, validation schema, and submission logic. VERY IMPORTANT: keys in initialValues property of this object must always be the same whenever `useForm` is called by a given component. This is because they are passed in the alphabetical order to React hooks such as useId. You don't have to make sure that keys are added in the same order in `initialValues` object every time you call `useForm` but YOU DO have to make sure that keys in `initialValues` are the same every time you call `useForm` in a component.
 * @returns {FormikProps<Values> & {
 *   hasError: { [InputControl in keyof Values]: boolean };
 *   required: { [InputControl in keyof Values]: boolean };
 *   id: { [InputControl in keyof Values]: string };
 * }} - Returns all Formik props along with additional properties:
 * - `hasError`: Indicates whether each input has an error that should be displayed.
 * - `required`: Indicates whether each input is required based on the validation schema.
 * - `ids`: Unique IDs for each input. These MUST be set on the corresponding input controls.
 *
 * ### Additional Behavior:
 * - Tracks inputs that have been changed and subsequently blurred. When such an input has an error, `hasError.[inputname]` is set to true in the `hasError` property of the return value of this hook so that the calling component can show the error message and/or highlight the input as having an error.
 * - On form submission:
 *     - validates all fields and sets the `hasError` state for all inputs (whether or not they have changed then blurred) in `hasError` property of returned object.
 *     - sets focus to first control with error
 * - Returns a `required` property in the returned object, which indicates whether each input is required based on the validation schema. This can be used to render the corresponding input control as required e.g. set `aria-required="true"` and/or show a red asterisk next to the field's label.
 * - Automatically generates unique IDs for each input field. Internally these are used to set focus to the first control that has an error when submit button is pressed.
 * ### Example Usage:
 * ```tsx
 * const form = useForm({
 *   initialValues: { name: '', email: '' },
 *   validationSchema: Yup.object({
 *     name: Yup.string().required('Name is required'),
 *     email: Yup.string().email('Invalid email').required('Email is required'),
 *   }),
 *   onSubmit: (values) => {
 *     console.log(values);
 *   },
 * });
 *
 * return (
 *   <form onSubmit={form.handleSubmit}>
 *     <input
 *       name="name"
 *       value={form.values.name}
 *       onChange={form.handleChange}
 *       onBlur={form.handleBlur}
 *       aria-required={form.required.name}
 *       aria-invalid={form.hasError.name}
 *       id={form.id.name}
 *     />
 *     <button type="submit">Submit</button>
 *   </form>
 * );
 * ```
 */
export default function useForm<Values extends FormikValues>(
  config: FormikConfig<Values>,
): FormikProps<Values> & {
  hasError: { [InputControl in keyof Values]: boolean };
  required: { [InputControl in keyof Values]: boolean };
  id: { [InputControl in keyof Values]: string };
} {
  //a utility function that creates an object with the same keys as
  //the inputs with values for all keys set to the same provided value.
  function createObjectWithKeyForEachInputAndSameValueForAllKeys<T>(
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

  const formik = useFormik(config);

  //names of validated inputs. These would be used below in computing
  //and returning several objects that indicate state, with respect
  //to validation, of the corresponding controls on the form.
  const namesOfValidatedInputs: (keyof typeof formik.initialValues)[] =
    Object.keys(formik.initialValues);

  // The two state variable given directly below keep track of inputs
  // that have changed at least once and have subsequently been exited
  // (i.e. blurred). This makes it ok to show their error state
  // (if any).
  //
  // State changes to these variables are performed by the three custom
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
  ] = useState(createObjectWithKeyForEachInputAndSameValueForAllKeys(false));

  const [inputsThatChangedThenBlurred, setInputsThatChangedThenBlurred] =
    useState(createObjectWithKeyForEachInputAndSameValueForAllKeys(false));

  //When there are errors on submit, then after Fromik's submit handler
  //has executed, submit handler the client provided (e.g.
  //to paost the form) has NOT executed, and Formik knows that there
  //are errors. Yet after Formik's submit handler has executed,
  //formik.errors is empty ({}).
  //The worst bit is that the cien component would render twice
  //once with formik.errors === {} and the next time with formik.errors
  //being populated, BUT just after mount, when no validation has yet
  //taken place or any input typed, if you press submit and there are
  //errors, NOT ONE BUT TWO RENDERS TAKE PLACE WITH formik.errors === {}
  //before on the THIRD RENDER formik.errors is populated.
  //
  //It seemed like a good idea to use formik.submitCount as
  //dependency of the effect that sets focus to fist error on submit
  //but look out for formik.errors === {}. This worked if submit
  //was done after some data had already been typed in but if,just after
  //load, without entering any data, you pressed submit, the first
  //two renders sould each have a different formik.submitCount so
  //effect would be called but each of thos times we would have
  //formik.errors === {}. On the third render, which does have
  //formik.errors populatred, formik.submitCount would not have changed
  //so effect would not run.
  //
  //So to get around this anomalous Formik behaviour, I set
  //the following state item to true in my own submit handler
  //when errors occur, then the effect can execute either one or two
  //times with formik.errors === {} and finally when formik.errors
  //is populated (either second or third render, we proceed to
  //set focus to first control with error
  //and reset the signal submitWithErrorsHappened back to false.
  //
  //This cause an extra render but it only happens on form submit
  //WHEN THERE ARE ERRORS. So it is not a big deal.
  //
  //MORE EFFICIENT ALTERNATIVES EXIST but are more complicated and
  //I didn't want to litter my code.
  const [submitWithErrorsHappened, setSubmitWithErrorHappened] =
    useState(false);

  //The following effect sets focus to the first control with error
  // on submit

  //disabling the following rule as we are using
  //submitWithErrorsHappened as a signal that is manually
  //reset to false when formik.errors !== {}. Until then
  //the effect will keep returning at the guard condition at start
  //which is similar to using a dependencies array as guard clause.
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!submitWithErrorsHappened) {
      //No errors on submit are indicated
      //so do nothing
      return;
    }

    //if we have come here, it's because errors occurred
    //on submit but we haven't yet set focus to the first
    //control with error.

    if (Object.keys(formik.errors).length === 0) {
      //TWO renders take place when submit button is pressed
      //(actually THREE such renders happen at mount)
      //all except last of which will have formik.errors === {}).
      //See comments on setSubmitWithErrorHappened state variable
      //above for more details.
      return;
    }

    //now set focus to the first control with error:

    //First, reset the signal that submit with error happened.
    //This is unpalatable as it would cause an
    //extra render. But - see comments on definition of this
    //state items for details - seemed to be the least bad
    //among the alternatives.
    setSubmitWithErrorHappened(false);

    //Second, find the first control with error
    const nameOfFirstInputWithError = namesOfValidatedInputs.find(
      (key) => hasError[key],
    );

    if (!nameOfFirstInputWithError) {
      //we shouldn't really be here but I don't want to
      //throw an error in production code.
      console.log(
        'The form has been re-rendered after submit button was pressed but there are no errors',
      );
      return;
    }

    //Third, set focus to the first control with error
    const firstControlWithError = document.getElementById(
      ids[nameOfFirstInputWithError],
    );
    if (!firstControlWithError)
      throw new Error(
        `Element was not found with id ${ids[nameOfFirstInputWithError]} for input ${String(nameOfFirstInputWithError)} that has an error`,
      );

    firstControlWithError.focus({ preventScroll: true });

    firstControlWithError.scrollIntoView({
      behavior: 'smooth',
      block: 'center', //avoids the complication of having to find and
      //focus the label instead
      inline: 'nearest', //default is fine
    });
  });

  //this object indicates which of the inputs is required
  //this could be used to set `aria-required="true"` on the
  //correpsonding form controls
  const required = createObjectWithKeyForEachInputAndSameValueForAllKeys(false);
  namesOfValidatedInputs.forEach((controlName) => {
    /*eslint-disable @typescript-eslint/no-unsafe-member-access */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const fieldSchema = config.validationSchema.fields[controlName].describe();
    /*eslint-disable @typescript-eslint/no-unsafe-member-access */
    required[controlName] = !fieldSchema.optional && !fieldSchema.nullable;
  });

  //ids of form controls.
  // It is convenient for this hook to generate and return
  //these for it can then hold on to these ids and then
  //jump to the first control with an error if there
  //is an error on submit.
  const ids = createObjectWithKeyForEachInputAndSameValueForAllKeys('');
  for (const controlName of namesOfValidatedInputs) {
    //disabling the following rule as the initialValues is documented
    //to indicate that keys must always be the same. Plus we have
    //ordered them already (alphabetically) so they
    //would always be iterated in the same order as long as the
    // set of keys remains the same.
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    ids[controlName] = useId();
  }

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

  const submitForm = async () => {
    await formik.submitForm();

    //if we are here, there have been errors

    //setting this to signal an error, while unpalatable,
    //was a better choice than alternatives. See comments
    //on this state items for more details.
    setSubmitWithErrorHappened(true);

    //set all inputs to changed then blurred
    setInputsThatChangedThenBlurred(
      createObjectWithKeyForEachInputAndSameValueForAllKeys(true),
    );
  };

  const hasError = createObjectWithKeyForEachInputAndSameValueForAllKeys(false);
  namesOfValidatedInputs.forEach((controlName) => {
    hasError[controlName] =
      inputsThatChangedThenBlurred[controlName] && !!formik.errors[controlName];
  });

  return {
    ...formik,
    submitForm,
    handleChange,
    handleBlur,
    hasError,
    required,
    id: ids,
  };
}
