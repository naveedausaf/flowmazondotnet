//Disabling the following rule because
// we need to import 'expect' from vitest
// (that I beleive has more or less the same interafce as Jest)
// as all expect matchers imported
//from '@storybook/test-runner' as well as from
// @sorybook/jest are async (return Promise).
//Vitest also already part of Storybook whereas with jest
//I would have had to install the jest package.
/* eslint-disable storybook/use-storybook-expect */

import AddProductPage from '@/pages/add-product';
import { ErrorCase, ErrorCases, ValidInputs } from './testdata';
import { allModes } from '../../../.storybook/modes.js';

import { within, userEvent, expect, waitFor } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/react';
import createAddProductPagePOM, {
  TextboxGet,
  TextboxQueries,
  accessibleNames,
} from './PageObjectModel';

import { http, HttpResponse } from 'msw';
import { config } from '@/utils/config';

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

//TODO: Replace fgetch API with reliable method with retry
//This is the next task in my GitHub project after crearing
//Storybook for the Add Product form.

export const Primary: Story = {};

//Not writing the following as checking for name without asterisk
//is part of most other tests because names without asterisks
//are exported as consts from the page object model.
//
//export const AsterisksOnRequiredFieldsNotPartOfAccessibleName: Story = {};

export const RequiredFieldsIdentifiedAsSuch: Story = {
  play: async ({ canvasElement }) => {
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();
    //check that the required fields are identified as such
    await expect(form.name.get().ariaRequired).toBeTruthy();
    await expect(form.description.get().ariaRequired).toBeTruthy();
    await expect(form.imageUrl.get().ariaRequired).toBeTruthy();
    await expect(form.price.get()).toBeTruthy();
  },
};

export const FormNameIsCorrect: Story = {
  play: async ({ canvasElement }) => {
    const formElement = within(canvasElement).getByRole('form', {
      name: accessibleNames.FormName,
    });
    await expect(formElement).toBeTruthy();
  },
};

export const InputModes: Story = {
  play: async ({ canvasElement }) => {
    //TODO: as I cannot verify that the correct virtual keyboard pops up
    //without rendering the form on a mobile device (or an emulator?),
    //this tests would be simplistic (and possibly quite brittle, though
    //we could mitigate this problem by making inputmode, and while
    //we're at it, automcomplete, bejhaviour part of the schema that
    //generally drives this test suite)

    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    //check that the inputmode is set correctly
    await expect(form.name.get().getAttribute('inputmode')).toEqual('text');
    await expect(form.description.get().getAttribute('inputmode')).toEqual(
      'text',
    );
    await expect(form.imageUrl.get().getAttribute('inputmode')).toEqual('url');
    await expect(form.price.get().getAttribute('inputmode')).toEqual('decimal');
  },
};

export const Autocomplete: Story = {
  play: async ({ canvasElement }) => {
    //TODO: This test is simialrly brittle to the inputmode test
    //put this info in schema and test the rendered coponent based
    //on the schema just as I have suggested for the inputmode test above

    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    //We want to set every field carefully to an
    //autocomplete value other than 'on' as it doubles up as a sufficient technique
    //for passing WCAG SC 1.3.5 (Identify Input Purpose).
    //check that the inputmode is set correctly
    await expect(form.name.get().getAttribute('autocomplete')).toEqual('name');
    await expect(form.description.get().getAttribute('autocomplete')).toEqual(
      'off',
    );
    await expect(form.imageUrl.get().getAttribute('autocomplete')).toEqual(
      'url',
    );
    await expect(form.price.get().getAttribute('autocomplete')).toEqual('off');
  },
};
export const LoadingStateOnSubmit: Story = {};

export const SubmitSuccessfully: Story = {
  name: 'Submit - Submit successfully',
  parameters: {
    msw: {
      handlers: [
        http.post(config.serviceUrls.product, async ({ request }) => {
          const newProduct = await request.json();
          await expect(newProduct).toEqual({
            name: ValidInputs.name,
            description: ValidInputs.description,
            imageUrl: ValidInputs.imageUrl,
            price: ValidInputs.price,
          });
          console.log(
            `submitted REST request was correct: ${JSON.stringify(newProduct)}`,
          );

          return HttpResponse.text(undefined, {
            headers: {
              Location: '/product/1',
              'Content-Length': '0',
              Date: new Date().toUTCString(),
            },
            status: 201,
          });
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    //fill in the form
    await userEvent.type(form.name.get(), ValidInputs.name);
    await userEvent.type(form.description.get(), ValidInputs.description);
    await userEvent.type(form.imageUrl.get(), ValidInputs.imageUrl);
    await userEvent.type(form.price.get(), ValidInputs.price);

    //submit the form
    await userEvent.click(form.getSubmitButton());
  },
};

export const ServerErrorOnSubmit: Story = {
  name: 'Submit - Server Error on Submit',
};

export const SubmitValidatesAllFieldsAndJumpsToFirstError: Story = {
  name: 'Validate - Validate all fields on Submit and  jump to first error',
  play: async ({ canvasElement }) => {
    //initialise
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    //submit the form
    await userEvent.click(form.getSubmitButton());

    //check that the error messages are displayed
    await expect(
      form.name.get({ description: ErrorCases.name.NameRequired.ErrorMessage }),
    ).toBeTruthy();
    await expect(
      form.description.get({
        description: ErrorCases.description.DescriptionRequired.ErrorMessage,
      }),
    ).toBeTruthy();
    await expect(
      form.imageUrl.get({
        description: ErrorCases.imageUrl.ImageUrlRequired.ErrorMessage,
      }),
    ).toBeTruthy();
    await expect(
      form.price.get({
        description: ErrorCases.price.PriceRequired.ErrorMessage,
      }),
    ).toBeTruthy();

    //check that the first error message is focused
    await waitFor(() => expect(form.name.get({})).toHaveFocus());
  },
};

export const SubmitWhenThereAreAlreadyErrorsJumpsToFirstError: Story = {
  name: 'Validate - Submit when there are already errors jumps to first error',
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await userEvent.type(form.name.get(), 'John Doe');
    const errorAssertsForLater = [
      //create an error in every field

      await typeErroneousInputAndTabOffAndAssertError(
        form.description,
        ErrorCases.description.DescriptionMaxLength,
      ),
      await typeErroneousInputAndTabOffAndAssertError(
        form.imageUrl,
        ErrorCases.imageUrl.ImageUrlIsValidUrl,
      ),
      await typeErroneousInputAndTabOffAndAssertError(
        form.price,
        ErrorCases.price.PriceNotNumeric,
      ),
    ];

    //submit the form
    await userEvent.click(form.getSubmitButton());

    //check that first field with error has focus
    await waitFor(() => expect(form.description.get({})).toHaveFocus());
    //check that the error messages are displayed
    errorAssertsForLater.forEach((assertError) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      assertError();
    });
  },
};

async function typeErroneousInputAndTabOffAndAssertError<TInput>(
  textboxQueries: TextboxQueries,
  errorCase: ErrorCase<TInput>,
) {
  const input = String(errorCase.InvalidValue);
  const textbox = textboxQueries.get();
  textbox.focus();
  //we type all but one char of the input by just
  //pasting it in order to increase performance
  await userEvent.paste(input.substring(0, input.length - 2));

  //now type the last character to ensure the invalid
  //input is complete but validation doesn't take place
  await userEvent.keyboard(input.substring(input.length - 2));

  //now go away from the control
  await userEvent.tab();

  //now check the input we tabbed away from has error
  const assertError = async () => {
    await expect(
      textboxQueries.get({ description: errorCase.ErrorMessage }),
    ).toBeTruthy();
    await expect(textbox.ariaInvalid).toBeTruthy();
  };
  await assertError();
  return assertError;
}

export const ValidateOnTypeButAfterFirstTabOff: Story = {
  name: 'Validate - On Type but after first Tab Off',
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();
    await validateTextboxOnTypeButAfterFirstTabOff(
      form.name,
      ErrorCases.name.NameMaxLength,
    );
    await validateTextboxOnTypeButAfterFirstTabOff(
      form.description,
      ErrorCases.description.DescriptionMaxLength,
    );
    await validateTextboxOnTypeButAfterFirstTabOff(
      form.imageUrl,
      ErrorCases.imageUrl.ImageUrlIsValidUrl,
    );

    await validateTextboxOnTypeButAfterFirstTabOff(
      form.price,
      ErrorCases.price.PriceNotNumeric,
    );
  },
};

async function validateTextboxOnTypeButAfterFirstTabOff<TInput>(
  textboxQueries: TextboxQueries,
  errorCase: ErrorCase<TInput>,
) {
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
    textboxQueries.query({ description: errorCase.ErrorMessage }),
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
}

export const NameErrors_ValidateOnTabOff: Story = {
  name: 'Validate - Name Errors on Tab Off',
  play: async ({ canvasElement }) => {
    //initialise
    const form = createAddProductPagePOM(canvasElement).getAddProductForm();

    await testTextbox(form.name.get, form.formElement, 'Name', ErrorCases.name);
  },
};

export const DescriptionErrors_ValidateOnTabOff: Story = {
  name: 'Validate - Description Errors on Tab Off',
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
  name: 'Validate - ImageUrl Errors on Tab Off',
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
  name: 'Validate - Price Errors on Tab Off',
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

async function testTextbox<TErrorCaseNames extends string, TInput>(
  textboxGetter: TextboxGet,
  form: HTMLElement,
  accessibleName: string,
  testCases: Record<TErrorCaseNames, ErrorCase<TInput>>,
) {
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
}
