//Disabling the following rule because
// we need to import 'expect' from vitest
// (that I beleive has more or less the same interafce as Jest)
// as all expect matchers imported
//from '@storybook/test-runner' as well as from
// @sorybook/jest are async (return Promise).
//Vitest also already part of Storybook whereas with jest
//I would have had to install the jest package.
/* eslint-disable storybook/use-storybook-expect */

import AddProductPage, { validationSchema } from '@/pages/add-product';
import { ErrorCase, ErrorCases } from './testdata';
import { allModes } from '../../../.storybook/modes.js';
import {
  SchemaFieldDescription,
  SchemaDescription,
  ValidationError,
} from 'yup';

import { fn, within, userEvent, expect } from '@storybook/test';
import { AssertionError } from 'assert';
import { ErrorMessage } from 'formik';
import { Meta, StoryObj } from '@storybook/react';
import createAddProductPagePOM, {
  TextboxGet,
  TextboxQueries,
  accessibleNames,
} from './PageObjectModel';

import { TestCase } from 'vitest/node';
import { access } from 'fs';
import { assert } from 'console';

const meta: Meta<typeof AddProductPage> = {
  component: AddProductPage,
  //excludeStories: ['accessibleNames'],

  parameters: {
    // 👇 Set default viewport for all component stories
    viewport: { defaultViewport: 'xl' },
    chromatic: {
      modes: { ...allModes },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AddProductPage>;

//TODO: Write a test in Playwright to pick up
//aria-live="assertive" set on name textbox
//I can pick it up with NVDA but not Guiepup's
//virtual screen reader.

//TODO: Add a beforeEach to meta that returns
//a function to run after each test that
//runs axe against the final (after play function)
//state of the rendered story.

export const Primary: Story = {};
export const InputModes: Story = {};
export const Autocomplete: Story = {};
export const SubmitSuccessfully: Story = {};

//error stories
export const SubmitValidateAllFieldsAndJumpsToFirstError: Story = {};
export const SubmitWhenThereAreAlreadyErrorsJumpsToFirstError: Story = {};

export const ValidateOnTypeButAfterFirstTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();
    validateTextboxOnTypeButAfterFirstTabOff(
      form.name,
      ErrorCases.name.NameMaxLength,
    );
  },
};

const validateTextboxOnTypeButAfterFirstTabOff = async (
  textboxQueries: TextboxQueries,
  errorCase: ErrorCase,
) => {
  const input = String(errorCase.InvalidValue);
  const textbox = textboxQueries.get();
  textbox.focus();
  //we type all but one char of the input by just
  //pasting it in order to increase performance
  await userEvent.paste(input.substring(0, input.length - 2));

  //now type the last character to ensure the invalid
  //input is complete but validation doesn't take place
  await userEvent.keyboard(input.substring(input.length - 2));

  await expect(
    await textboxQueries.query({ description: errorCase.ErrorMessage }),
  ).toBeFalsy(); //because control with error message should not exist

  //now go away from the control
  await userEvent.tab();
  await expect(
    textboxQueries.get({ description: errorCase.ErrorMessage }),
  ).toBeTruthy();

  //and come back to the control
  await userEvent.tab({ shift: true });

  //get to end of text which would be selected
  await userEvent.keyboard('{arrowright}');

  //now delete one character
  await userEvent.keyboard('{backspace}');

  //and type it back again
  await userEvent.keyboard(input.substring(input.length - 1));

  //having tabbed off once and come back to the control,
  //this type validation should have happened o ntype and
  //so the error message should have appeared:
  await expect(
    textboxQueries.get({ description: errorCase.ErrorMessage }),
  ).toBeTruthy();
};
//Not writing the following as checking for name without asterisk
//is part of most other tests because names without asterisks
//are exported as consts from the page object model.
//
//export const AsterisksOnRequiredFieldsNotPartOfAccessibleName: Story = {};

export const RequiredFieldsIdentifiedAsSuch: Story = {
  play: async ({ canvasElement }) => {
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();
    //check that the required fields are identified as such
    expect(form.name.get().ariaRequired).toBeTruthy();
    expect(form.description.get().ariaRequired).toBeTruthy();
    expect(form.imageUrl.get().ariaRequired).toBeTruthy();
    expect(form.price.get()).toBeTruthy();
  },
};

export const FormNameIsCorrect: Story = {
  play: async ({ canvasElement }) => {
    const formElement = within(canvasElement).getByRole('form', {
      name: accessibleNames.FormName,
    });
    expect(formElement).toBeTruthy();
  },
};

export const NameErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(form.name.get, form.formElement, 'Name', ErrorCases.name);
  },
};

export const DescriptionErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(
      form.description.get,
      form.formElement,
      'Description',
      ErrorCases.description,
    );
  },
};

export const ImageUrlErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(
      form.imageUrl.get,
      form.formElement,
      'Image URL',
      ErrorCases.imageUrl,
    );
  },
};

export const PriceErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(
      form.price.get,
      form.formElement,
      accessibleNames.Price,
      ErrorCases.price,
    );
  },
};

const testTextbox = async <TErrorCaseNames extends string>(
  textboxGetter: TextboxGet,
  form: HTMLElement,
  accessibleName: string,
  testCases: Record<TErrorCaseNames, ErrorCase>,
) => {
  const textbox = textboxGetter();

  //iterate over error test cases
  for (const errorCaseName in testCases) {
    textbox.focus();

    //tabbing back and tabbing in again eansures that
    //the announcement of the form by screen reader
    //has already taken place otherwise my screen reader
    //assert fails.
    //It also seems to make the test more robust in storybook
    await userEvent.tab({ shift: true });
    await userEvent.tab();

    const errorCase = testCases[errorCaseName];
    console.log(
      `testing against error case named ${errorCaseName} and values ${JSON.stringify(errorCase)}`,
    );

    //For performance, test input is pasted in
    //as passing long input to userEvent.type or
    //userEvent.keybaord can have excruciatingly slow
    //the test down. However, this doesn't cause any
    //onchange to fire in the input. Instead of using
    //fireEvent API, I do this by typing a space
    //the typing backspace.
    await userEvent.keyboard(' {backspace}');
    if (errorCase.InvalidValue) {
      await userEvent.paste(
        //not converting numbers in input of tests case
        //to string results in errors
        String(errorCase.InvalidValue),
      );
    }
    await userEvent.tab();

    textboxGetter({ description: errorCase.ErrorMessage });
    await expect(textbox.ariaInvalid).toBeTruthy();

    await userEvent.tab({ shift: true });
  }
};
