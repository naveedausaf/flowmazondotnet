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
import { virtual as virtualScreenReader } from '@guidepup/virtual-screen-reader';

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

type Story = StoryObj<typeof AddProductPage>;

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

export const AllNameErrors_ValidateOnTabOff: Story = {
  play: async ({ canvasElement, step }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    const nameTextbox = form.getName();
    let errorCaseName: keyof typeof ErrorCases.name;

    await virtualScreenReader.start({ container: form.formElement });
    nameTextbox.focus();

    //iterate over error test cases
    for (errorCaseName in ErrorCases.name) {
      const errorCase = ErrorCases.name[errorCaseName];
      await userEvent.keyboard(tlNormaliseString(errorCase.InvalidValue));

      await userEvent.tab();

      await expect(
        form.queryName_withAccessibleDescription(errorCase.ErrorMessage),
      ).not.toBeNull();
      await expect(nameTextbox.ariaInvalid).not.toBe('false');
      await expect(nameTextbox.ariaInvalid).not.toBeFalsy();

      await await userEvent.tab({ shift: true });
    }
  },
};

// export const DescriptionErrors: Story = {
//   play: async ({ canvasElement }) => {
//     const form = createAddProductPagePOM(canvasElement).getAddProductForm();
//     const descriptionTextbox = form.getDescription();
//   },
// };
