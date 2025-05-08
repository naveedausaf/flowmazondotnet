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
  console.log('START useForm EXECUTION...');
  const formik = useFormik(config);
  console.log(`In useForm, formik .errors: ${JSON.stringify(formik.errors)}`);

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

  //names of validated inputs. These would be used below in computing
  //and returning several objects that indicate state, with respect
  //to validation, of the corresponding controls on the form.
  const namesOfValidatedInputs: (keyof typeof formik.initialValues)[] =
    Object.keys(formik.initialValues);

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

  //this is a boolean that would be flipped by submit handler
  //to force an effect to to run that should only
  //run if submit was pressed and this was what
  //caused the re-render of the client component of this hook.
  //initially we set it to udnefined though so the effect
  //doesn't run on mount.
  const [submitFlipFlop, setSubmitFlipFlop] = useState<boolean | undefined>(
    undefined,
  );
  const [emptyRenderFlipFlop, setEmptyRenderFlipFlop] = useState(false);

  useEffect(
    () => {
      console.log('executing EFFECT...');
      console.log(`submitfliFlop: ${String(submitFlipFlop)}`);
      console.log(
        `formik errors: ${String(Object.keys(formik.errors).length)}`,
      );

      if (submitFlipFlop === undefined) {
        //submit has not been pressed at all since mount
        //Otherwise it would have been true or false.
        //Hence do nothing:
        return;
      }

      //As component TestStrictModeInStorybook and its stories
      //show, Storybook does NOT render components under StrictMode.
      //Yet my console.log statements here and in add-product page
      //component showed that after SUBMIT button was pressed,
      //the render function of the component was getting called
      //twice.
      //First time round,formik.errors would be {} (and so
      //`hasError` would get computed as having false for ever
      // input). Next time formik.errors would be populated.
      // This was messing up the effect's execution as it
      //uses a signalling flip-flop and so would execute only
      //the first time render functrionw as called,
      //there would be no errors and so it would do nothing. But
      //the next time render functionw as called with correctly
      //indicated errors, the flip flop dependenc of the
      //effect would remain unchagned so it wouldn't run at all.
      //THEREFORE, I detect the first of the duplicate executions
      //of the render function which lead to the execution
      //of the effect function (probabaly caused by Formik
      //setting a state variable the first time round to trigger
      //a re-render, for whatever reason). Here, I set the flip flip
      //so that the effect would get called a second time (after the
      //next render is complete).

      if (Object.keys(formik.errors).length === 0) {
        //we are in first of the two renders that take place
        //when submit button is pressed. So toggle the flipflop
        //we the effect runs the next time also:
        setEmptyRenderFlipFlop(!emptyRenderFlipFlop);
        return;
      }

      const nameOfFirstInputWithError = namesOfValidatedInputs.find(
        (key) => hasError[key],
      );

      console.log(namesOfValidatedInputs);
      console.log(hasError);
      console.log(nameOfFirstInputWithError);

      if (!nameOfFirstInputWithError) {
        //we shouldn't really be here but I don't want to
        //throw an error in production code.
        console.log(
          'The form has been re-rendered after submit button was pressed but there are no errors',
        );
        return;
      }

      //if we are here, we have an error
      //we need to set focus to the first control with error
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
    },
    //Disabling following eslint rule as we specifically
    //want to run this effect IF AND ONLY IF submit button
    //press is what cause this render.
    //This would be indicated by value of submitFlipFlop
    //flipping from it previous value (i.e. from false to true
    //or true to false, initially it would be undefined
    //though in which case we would not execute the
    //effect, as guard condition above ensures)
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [submitFlipFlop, emptyRenderFlipFlop],
  );

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
      createObjectWithKeyForEachInputAndSameValueForAllKeys(true),
    );

    setSubmitFlipFlop(!submitFlipFlop);
  };

  const hasError = createObjectWithKeyForEachInputAndSameValueForAllKeys(false);
  namesOfValidatedInputs.forEach((controlName) => {
    hasError[controlName] =
      inputsThatChangedThenBlurred[controlName] && !!formik.errors[controlName];
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

  return {
    ...formik,
    handleSubmit,
    handleChange,
    handleBlur,
    hasError,
    required,
    id: ids,
  };
}
