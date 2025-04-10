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
import {
  SchemaFieldDescription,
  SchemaDescription,
  ValidationError,
} from 'yup';

import { expect } from 'vitest';
import { AssertionError } from 'assert';
import { ErrorMessage } from 'formik';
import { Meta } from '@storybook/react';

const meta: Meta<typeof AddProductPage> = {
  component: AddProductPage,
  excludeStories: ['ErrorCases'],
};

export default meta;

//FIRST INSTANCE of why reflecting on Yup schema is
//so painful:
//
// The abomination below necessary to get `max` value
//in a max constraint.
//
//validationSchema.describe()
// .fields.name.tests.find((obj) => obj.name === 'max').params.max + 1

//NOTE: re. typescript assertion functions below,
//they cannot be arrow functions or TS throws errors.

//better than 'as SchemaDescription' all over the place
function assertFieldSchemaIsSchemaDescription(
  fieldSchema: SchemaFieldDescription,
): asserts fieldSchema is SchemaDescription {
  if ((fieldSchema as SchemaDescription).tests === undefined) {
    throw new AssertionError({
      message:
        'The provided Yup schema for a field was not of type SchemaDescription',
    });
  }
}

function assertTestParamsDefined(
  testParams: unknown,
): asserts testParams is NonNullable<unknown> {
  expect(testParams).toBeDefined();
}

//A bit unorthodox, but in these createXXXSchema functions
//below, I am asserting that the Yup schema has not changed
//from what was expected. If it has, we would update the
//TestCaseGenerator as well as add test cases in the
//Screen (pure presentational page component for this page)

//SECOND INSTANCE of how difficult it is to reflect
//  why I need to move away from Yup:
//why should reflectin on error message supplied
//at schema construction time be so painful?
const getValidationErrorMessage = (path: string, value: unknown) => {
  try {
    validationSchema.validateSyncAt(path, value);

    //as a fallback, if no ValidationError is thrown then
    //we throw an AssertionError
    throw new AssertionError({
      message: `An error should have been thrown whan validating value "${value}" at path ${path} using the YUP schema`,
    });
  } catch (ex) {
    //we know for a fact that ex is ValidationError
    const err = ex as ValidationError;
    return err.message;
  }
};

const getFieldSchema = (
  fieldSchema: SchemaFieldDescription,
  expectedNumOfTests: number,
) => {
  assertFieldSchemaIsSchemaDescription(fieldSchema);
  expect(fieldSchema.tests.length).toEqual(expectedNumOfTests);
  return fieldSchema;
};
function getTest(fieldSchema: SchemaDescription, testName: string) {
  const test = fieldSchema.tests.find((obj) => obj.name === testName);
  if (!test) {
    throw new AssertionError({
      message: `The test named ${testName} in YUP field schema does not exist.`,
    });
  }

  return {
    name: testName,
    params: test.params,
  };
}

const createImageUrlErrorCases = () => {
  const imageUrlSchema = getFieldSchema(
    validationSchema.fields.imageUrl.describe(),
    2,
  );

  getTest(imageUrlSchema, 'required');
  const max = getTest(imageUrlSchema, 'max');
  assertTestParamsDefined(max.params);
  const urlTooLong =
    'http://www.example.com/image123-' + 'e'.repeat(max.params.max as number);

  getTest(imageUrlSchema, 'url');
  const notAUrl = 'e'.repeat();
};

const createDescriptionErrorCases = () => {
  const descriptionSchema = getFieldSchema(
    validationSchema.fields.description.describe(),
    1,
  );
  getTest(descriptionSchema, 'required');
  const max = getTest(descriptionSchema, 'max');
  assertTestParamsDefined(max.params);
  const tooLongDescription =
    'Lorem ' + 'ipsum '.repeat(Math.ceil((max.params.max as number) / 6));
  return {
    DescriptionRequired: {
      InvalidValue: '',
      ErrorMessage: getValidationErrorMessage('description', ''),
    },
    DescriptionMaxLength: {
      InvalidValue: tooLongDescription,
      ErrorMessage: getValidationErrorMessage(
        'description',
        tooLongDescription,
      ),
    },
  };
};

const createNameErrorCases = () => {
  const nameSchema = getFieldSchema(validationSchema.fields.name.describe(), 2);
  const max = getTest(nameSchema, 'max');
  assertTestParamsDefined(max.params);
  const tooLongName = 'Jane Doe' + 'e'.repeat(max.params.max as number);

  getTest(nameSchema, 'required');

  return {
    NameMaxLength: {
      InvalidValue: tooLongName,
      ErrorMessage: getValidationErrorMessage('name', tooLongName),
    },
    NameRequired: {
      InvalidValue: '',
      ErrorMessage: getValidationErrorMessage('name', ''),
    },
  };
};

const createErrorCases = () => {
  expect(validationSchema.describe().fields).toHaveLength(4);

  return {
    ...createNameErrorCases(),
    ...createDescriptionErrorCases(),
    ...createImageUrlErrorCases(),
  };
};

export const ErrorCases = createErrorCases();
