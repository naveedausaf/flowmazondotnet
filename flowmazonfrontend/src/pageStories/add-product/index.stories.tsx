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
  parameters: {
    // 👇 Set default viewport for all component stories
    viewport: { defaultViewport: 'xl' },
  },
};

export default meta;

//TODO: NOTE FIRST INSTANCE of why reflecting on Yup schema is
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
  //expect(testParams).toBeDefined();
}

//A bit unorthodox, but in these createXXXSchema functions
//below, I am asserting that the Yup schema has not changed
//from what was expected. If it has, we would update the
//TestCaseGenerator as well as add test cases in the
//Screen (pure presentational page component for this page)

//TODO:  NOTE SECOND INSTANCE of how difficult it is to reflect
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
  //expect(fieldSchema.tests.length).toEqual(expectedNumOfTests);
  return fieldSchema;
};
function getTest(fieldSchema: SchemaDescription, testName: string) {
  const test = fieldSchema.tests.find((obj) => obj.name === testName);
  if (test) {
    return {
      name: testName,
      params: test.params,
    };
  }

  // if (
  //   testName === 'required' &&
  //   !fieldSchema.optional &&
  //   !fieldSchema.nullable
  // ) {
  //   //special case checking for required: if
  //   //feld is a number (but possibly if it is any
  //   //non-string type), `required` does not appear
  //   //in .tests and has to be tested for as above.
  //   return {
  //     name: testName,
  //     //params should be undefined
  //   };
  // }

  throw new AssertionError({
    message: `The test named ${testName} in YUP field schema does not exist.`,
  });
}

type ErrorCase = {
  InvalidValue: any;
  ErrorMessage: string;
};

function getErrorCaseFactory(fieldPath: string) {
  return (invalidValue: any): ErrorCase => {
    return {
      InvalidValue: invalidValue,
      ErrorMessage: getValidationErrorMessage(fieldPath, invalidValue),
    };
  };
}

const createPriceErrorCases = () => {
  const errorCase = getErrorCaseFactory('price');
  const priceSchema = getFieldSchema(
    validationSchema.fields.price.describe(),
    3,
  );

  getTest(priceSchema, 'required');
  const max = getTest(priceSchema, 'max');
  assertTestParamsDefined(max.params);
  const priceAboveMax = (max.params.max as number) + 1;

  const min = getTest(priceSchema, 'min');
  assertTestParamsDefined(min.params);
  const priceBelowMin = (min.params.min as number) - 1;

  getTest(priceSchema, 'currency');

  const priceNotMoney = (max.params.min as number) + 0.001;

  return {
    PriceRequired: errorCase(''),
    PriceAboveMax: errorCase(priceAboveMax),
    PriceBelowMin: errorCase(priceBelowMin),
    PriceNotMoney: errorCase(priceNotMoney),
  };
};

const createImageUrlErrorCases = () => {
  const errorCase = getErrorCaseFactory('imageUrl');
  const imageUrlSchema = getFieldSchema(
    validationSchema.fields.imageUrl.describe(),
    3,
  );

  getTest(imageUrlSchema, 'required');
  const max = getTest(imageUrlSchema, 'max');
  assertTestParamsDefined(max.params);
  const urlTooLong =
    'http://www.example.com/image123-' + 'e'.repeat(max.params.max as number);

  getTest(imageUrlSchema, 'url');
  const notAUrl = 'e'.repeat(Math.ceil((max.params.max as number) / 2));
  return {
    ImageUrlRequired: errorCase(''),
    ImageUrlMaxLength: errorCase(urlTooLong),
    ImageUrlIsValidUrl: errorCase(notAUrl),
  };
};

const createDescriptionErrorCases = () => {
  const errorCase = getErrorCaseFactory('description');
  const descriptionSchema = getFieldSchema(
    validationSchema.fields.description.describe(),
    2,
  );
  getTest(descriptionSchema, 'required');
  const max = getTest(descriptionSchema, 'max');
  assertTestParamsDefined(max.params);
  const tooLongDescription =
    'Lorem ' + 'ipsum '.repeat(Math.ceil((max.params.max as number) / 6));
  return {
    DescriptionRequired: errorCase(''),
    DescriptionMaxLength: errorCase(tooLongDescription),
  };
};

const createNameErrorCases = () => {
  const errorCase = getErrorCaseFactory('name');
  const nameSchema = getFieldSchema(validationSchema.fields.name.describe(), 2);
  const max = getTest(nameSchema, 'max');
  assertTestParamsDefined(max.params);
  const tooLongName = 'Jane Doe' + 'e'.repeat(max.params.max as number);

  getTest(nameSchema, 'required');

  return {
    NameMaxLength: errorCase(tooLongName),
    NameRequired: errorCase(''),
  };
};

const createErrorCases = () => {
  //expect(validationSchema.describe().fields).toHaveLength(4);

  return {
    name: createNameErrorCases(),
    description: createDescriptionErrorCases(),
    imageUrl: createImageUrlErrorCases(),
    price: createPriceErrorCases(),
  };
};

export const ErrorCases = createErrorCases();
