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
import createAddProductPagePOM, { TextboxGetter } from './PageObjectModel';
import { virtual } from '@guidepup/virtual-screen-reader';

import { TestCase } from 'vitest/node';
import { access } from 'fs';

const meta: Meta<typeof AddProductPage> = {
  component: AddProductPage,
  excludeStories: ['ErrorCases'],

  parameters: {
    // 👇 Set default viewport for all component stories
    viewport: { defaultViewport: 'xl' },
    chromatic: {
      modes: { ...allModes },
    },
  },
};

export default meta;

const tlNormaliseString = (s: string) => '{backspace}' + (s || ' {backspace}');

const formName = 'add product';

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
export const ValidateOnTypeButAfterFirstTabOff: Story = {};
export const AsterisksOnRequiredFieldsNotPartOfAccessibleName: Story = {};
export const RequiredFieldsIdentifiedAsSuch: Story = {};
export const FormNameIsCorrect: Story = {};

export const NameErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(form.getName, form.formElement, 'Name', ErrorCases.name);
  },
};

export const DescriptionErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(
      form.getDescription,
      form.formElement,
      'Description',
      ErrorCases.description,
    );
  },
};

const testTextbox = async <TErrorCaseNames extends string>(
  textboxGetter: TextboxGetter,
  form: HTMLElement,
  accessibleName: string,
  testCases: Record<TErrorCaseNames, ErrorCase>,
) => {
  const textbox = textboxGetter();
  textbox.focus();

  await virtual.start({ container: form });

  //tabbing back and tabbing in again eansures that
  //the announcement of the form by screen reader
  //has already taken place otherwise my screen reader
  //assert fails.
  //It also seems to make the test more robust in storybook
  await userEvent.tab({ shift: true });
  await userEvent.tab();

  let isFirstTimeStoppingOnElement = true;
  let lastErrorCaseValue = '';
  let lastErrorCaseMessage;
  //iterate over error test cases
  for (const errorCaseName in testCases) {
    if (isFirstTimeStoppingOnElement) {
      await expect(await virtual.lastSpokenPhrase()).toEqual(
        `textbox, ${accessibleName}, not invalid, required`,
      );
      isFirstTimeStoppingOnElement = false;
    } else {
      await expect(await virtual.lastSpokenPhrase()).toEqual(
        `textbox, ${accessibleName}, ${lastErrorCaseValue ? lastErrorCaseValue + ', ' : ''}${lastErrorCaseMessage}, invalid, required`,
      );
    }

    const errorCase = testCases[errorCaseName];
    console.log(`testing against error case ${errorCase}`);

    //For performance, test input is pasted in
    //as passing long input to userEvent.type or
    //userEvent.keybaord can have excruciatingly slow
    //the test down. However, this doesn't cause any
    //onchange to fire in the input. Instead of using
    //fireEvent API, I do this by typing a space
    //the typing backspace.
    await userEvent.keyboard(' {backspace}');
    if (errorCase.InvalidValue) {
      await userEvent.paste(errorCase.InvalidValue);
    }
    await userEvent.tab();

    textboxGetter({ description: errorCase.ErrorMessage });
    await expect(textbox.ariaInvalid).toBeTruthy();

    await userEvent.tab({ shift: true });
    lastErrorCaseValue = errorCase.InvalidValue;
    lastErrorCaseMessage = errorCase.ErrorMessage;
  }

  await virtual.stop();
};
