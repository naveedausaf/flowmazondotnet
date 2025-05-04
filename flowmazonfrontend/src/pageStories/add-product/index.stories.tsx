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
import { ErrorCases } from './testdata';
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
import createAddProductPagePOM from './PageObjectModel';
import { virtual } from '@guidepup/virtual-screen-reader';

import { TestCase } from 'vitest/node';

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

    await virtual.start({ container: form.formElement });

    const nameTextbox = form.getName();
    let errorCaseName: keyof typeof ErrorCases.name;

    nameTextbox.focus();

    //tabbing back out and tabbing in again seems to make
    //the unit test more robust in storybook
    await userEvent.tab({ shift: true });
    await userEvent.tab();

    let isFirstTimeStoppingOnElement = true;
    let lastErrorCaseValue = '';
    let lastErrorCaseMessage;
    //iterate over error test cases
    for (errorCaseName in ErrorCases.name) {
      if (isFirstTimeStoppingOnElement) {
        await expect(await virtual.lastSpokenPhrase()).toEqual(
          'textbox, Name, not invalid, required',
        );
        isFirstTimeStoppingOnElement = false;
      } else {
        await expect(await virtual.lastSpokenPhrase()).toEqual(
          `textbox, Name, ${lastErrorCaseValue}, ${lastErrorCaseMessage}, invalid, required`,
        );
      }

      const errorCase = ErrorCases.name[errorCaseName];

      await userEvent.keyboard(tlNormaliseString(errorCase.InvalidValue));

      await userEvent.tab();

      form.getName({ description: errorCase.ErrorMessage });

      await expect(nameTextbox.ariaInvalid).toBeTruthy();

      await userEvent.tab({ shift: true });
      lastErrorCaseValue = errorCase.InvalidValue;
      lastErrorCaseMessage = errorCase.ErrorMessage;
    }

    await virtual.stop();
  },
};

export const DescriptionErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    const descriptionTextbox = form.getDescription();
    let errorCaseDescription: keyof typeof ErrorCases.description;

    descriptionTextbox.focus();

    await virtual.start({ container: form.formElement });

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
    for (errorCaseDescription in ErrorCases.description) {
      if (isFirstTimeStoppingOnElement) {
        await expect(await virtual.lastSpokenPhrase()).toEqual(
          'textbox, Description, not invalid, required',
        );
        isFirstTimeStoppingOnElement = false;
      } else {
        await expect(await virtual.lastSpokenPhrase()).toEqual(
          `textbox, Description, ${lastErrorCaseValue ? lastErrorCaseValue + ', ' : ''}${lastErrorCaseMessage}, invalid, required`,
        );
      }

      const errorCase = ErrorCases.description[errorCaseDescription];
      console.log(errorCase);

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

      form.getDescription({ description: errorCase.ErrorMessage });
      await expect(descriptionTextbox.ariaInvalid).toBeTruthy();

      await userEvent.tab({ shift: true });
      lastErrorCaseValue = errorCase.InvalidValue;
      lastErrorCaseMessage = errorCase.ErrorMessage;
    }

    await virtual.stop();
  },
};
