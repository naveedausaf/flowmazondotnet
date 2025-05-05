import {
  SchemaDescription,
  SchemaFieldDescription,
  ValidationError,
} from 'yup';
import AddProductPage, { validationSchema } from '@/pages/add-product';
import { TestDataError } from '@/utils/TestDataError';

export type ErrorCase = {
  InvalidValue: any;
  ErrorMessage: string;
};

//TODO: NOTE FIRST INSTANCE of why reflecting on Yup schema is
//so painful:
//
// The abomination below necessary to get `max` value
//from a max constraint.
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
    throw new TestDataError(
      'The provided Yup schema for a field was not of type SchemaDescription',
    );
  }
}

function assertTestParamsDefined(
  testParams: unknown,
): asserts testParams is NonNullable<unknown> {
  if (!testParams)
    throw new TestDataError(
      'params property of field schema in YUP schema is not defined',
    );
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
    validationSchema.validateSyncAt(path, { [path]: value });

    //as a fallback, if no ValidationError is thrown then
    //we throw an TestDataError
    throw new TestDataError(
      `An error should have been thrown whan validating value "${value}" at path ${path} using the YUP schema`,
    );
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
  if (fieldSchema.tests.length !== expectedNumOfTests)
    throw new TestDataError(
      `field schema for field ${fieldSchema?.label} was expected to have ${expectedNumOfTests} but had ${fieldSchema?.tests?.length} tests`,
    );

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

  if (
    testName === 'required' &&
    !fieldSchema.optional &&
    !fieldSchema.nullable
  ) {
    //special case checking for required: if
    //feld is a number (but possibly if it is any
    //non-string type), `required` does not appear
    //in .tests and has to be tested for as above.
    return {
      name: testName,
      //params should be undefined
    };
  }

  throw new TestDataError(
    `The test named ${testName} in YUP field schema does not exist.`,
  );
}

function getErrorCaseFactory(fieldPath: string) {
  return (invalidValue: any): ErrorCase => {
    const errorMessage = getValidationErrorMessage(fieldPath, invalidValue);
    // console.log(
    //   `for fieldPath ${fieldPath} I have value '${invalidValue}' and error message '${errorMessage}'`,
    // );
    return {
      InvalidValue: invalidValue,
      ErrorMessage: errorMessage,
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

  const priceNotMoney = (min.params.min as number) + 0.001;

  const priceNotNumeric = 'not-a-number';

  return {
    //In other fields, which are declared to be .string() and not
    //.number() in the YUP schema, passing in '' to errorCase
    //would have returned an error case object with the error message
    //indicating the field was required.
    //However, in the following error case, we pass undefined
    //to get the same error message as passing in empty string would
    // instead trigger the `.number() constraint.
    //Formik presumably converts an empty string in a text box to
    //undefined also because it correctly shows "Price is required"
    //message when yo uenter empty string (no text at all) in the
    //price text box
    PriceRequired: errorCase(undefined),
    PriceAboveMax: errorCase(priceAboveMax),
    PriceBelowMin: errorCase(priceBelowMin),
    PriceNotMoney: errorCase(priceNotMoney),
    PriceNotNumeric: errorCase(priceNotNumeric),
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
  const notAUrl = 'http / not-a-url';
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
  const tooLongName = 'John Doe' + 'e'.repeat((max.params.max as number) - 7);

  getTest(nameSchema, 'required');

  return {
    NameMaxLength: errorCase(tooLongName),
    NameRequired: errorCase(''),
  };
};

const createErrorCases = () => {
  const expectedNumOfFields = 4;
  const actualNumOfFields = Object.keys(
    validationSchema.describe().fields,
  ).length;

  if (actualNumOfFields !== expectedNumOfFields)
    throw new TestDataError(
      `expected ${expectedNumOfFields} fields to be defined in the schema but there were ${actualNumOfFields}`,
    );

  return {
    name: createNameErrorCases(),
    description: createDescriptionErrorCases(),
    imageUrl: createImageUrlErrorCases(),
    price: createPriceErrorCases(),
  };
};

export const ErrorCases = createErrorCases();
