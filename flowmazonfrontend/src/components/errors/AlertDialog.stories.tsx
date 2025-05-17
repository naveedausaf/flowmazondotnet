/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Meta, StoryObj } from '@storybook/react';
import { fn, waitFor } from '@storybook/test';
import { TestCase } from './testdata';
import { within, expect, userEvent } from '@storybook/test';
import AlertDialog from './AlertDialog';
import { useEffect, useId, useState } from 'react';
import { resolve } from 'node:path';
import { error } from 'node:console';

const meta: Meta<typeof AlertDialog> = {
  component: AlertDialog,
};

export default meta;

type Story = StoryObj<typeof AlertDialog>;

export const Primary: Story = {
  args: {
    ...TestCase,
  },
};

const waitInMilliseconds = 5;
const productNameLabel = 'Product Name';
const productPriceLabel = 'Price per unit';
const productDescriptionLabel = 'Product Description';

export const AlertDialogIsAccessible: Story = {
  args: {
    //I could have spread TestCase directly in the
    //component-under-tests being instantiated in render function below.
    //But docs say using args is better e.g. because
    //it allows you to change arg values using Controls addon
    ...TestCase,
  },
  render: (args) => {
    const [
      serverErrorOccurredOnSubmission,
      setServerErrorOccurredOnSubmission,
    ] = useState(false);

    const [nameValue, setNameValue] = useState('');
    const [priceValue, setPriceValue] = useState('');
    const [descriptionValue, setDescriptionValue] = useState('');

    const productNameId = useId();
    const productPriceId = useId();
    const productDescriptionId = useId();
    const submittButtonId = useId();
    return (
      <>
        <AlertDialog
          {...args}
          open={serverErrorOccurredOnSubmission}
          elementIdToFocusAfterDialogClosed={
            document.activeElement?.id || productNameId
          }
          onClose={() => {
            setServerErrorOccurredOnSubmission(false);
          }}
        />
        <form
          aria-label='test form'
          action={async () => {
            return new Promise((resolve) => {
              setTimeout(() => {
                //throwing an error after a delay to simulate a server error
                //
                //Trying to use timer mocks was very painful:
                //1. vi import from vitest throws error
                //2. since previously I tried to import expect from vitest and
                //jest and that threw errors (in other tests) I have assumed
                //trying to import Jest timer mocks would alwo throw errors
                //3. importing sinon fake timer - both from 'sinon' and from
                //its '@sinon/fake-timers' was painful and I gave up. However
                //using local (non-global) timers directly from
                //`@sinon/fake-timers` could have worked but it showed bundling
                //errors in storybook build even though stories were rendering.
                //So I gave up on it out of caution.
                //
                //INSTEAD, I am choosing to pay an arbitrary and small (5ms)
                //penalty for using a real timer
                console.log(
                  `After waiting for ${String(waitInMilliseconds)}ms to simulate form submission, now indicating error during submission and resolving Promise`,
                );
                setServerErrorOccurredOnSubmission(true);
                resolve();
              }, waitInMilliseconds);
            });
          }}
        >
          <div>
            <label htmlFor={productNameId}>{productNameLabel}</label>
            <input
              type='text'
              id={productNameId}
              name='productName'
              onChange={(e) => {
                setNameValue(e.currentTarget.value);
              }}
              value={nameValue}
            />
          </div>
          <div>
            <label htmlFor={productPriceId}>{productPriceLabel}</label>
            <input
              type='text'
              name='productPrice'
              id={productPriceId}
              onChange={(e) => {
                setPriceValue(e.currentTarget.value);
              }}
              value={priceValue}
            />
          </div>
          <div>
            <label htmlFor={productDescriptionId}>
              {productDescriptionLabel}
            </label>
            <input
              type='text'
              name='productDescription'
              id={productDescriptionId}
              onChange={(e) => {
                setDescriptionValue(e.currentTarget.value);
              }}
              value={descriptionValue}
            />
          </div>
          <button id={submittButtonId} type='submit'>
            Submit Form
          </button>
        </form>
      </>
    );
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    //now, the form should exist but alert dialog should not exist in accessibility tree
    await expect(canvas.getByRole('form')).toBeTruthy();
    await expect(canvas.queryByRole('alertdialog')).toBeFalsy();

    //ener something in all three field, then come back to
    //second one and move to the end of the field.
    //we would expect to come back to the same field
    //and in the same state (i.e. text not selected
    //as happens when you tab to a field but rather
    //text being unselected and cusror at the end of the field)
    await userEvent.type(
      canvas.getByLabelText(productNameLabel),
      'Read Apples',
    );
    await userEvent.tab();
    const partialPriceValue = '0.5';
    await userEvent.type(
      canvas.getByLabelText(productPriceLabel),
      partialPriceValue,
    );
    await userEvent.tab();
    await userEvent.type(
      canvas.getByLabelText(productDescriptionLabel),
      'Finest British Red Apples',
    );
    await userEvent.tab({ shift: true });
    await userEvent.type(canvas.getByLabelText(productPriceLabel), '{end}');

    //pressing enter now should submit the form
    //and cause an error to be thrown
    //and the alert dialog to be shown
    await userEvent.keyboard('{Enter}');

    // wait for alertdialog role with exepcted accessibility attributes to come up
    const dialog = await canvas.findByRole('alertdialog', {
      name: TestCase.title,
      description: TestCase.description,
    });

    //make sure the form hasn't disappeared,
    //this is a FRIVOLOUS assertion but this is what
    //ErrorBoundary (from react-error-boundary package) used
    //to do which is the only reason why I stopped using it
    await expect(canvas.getByRole('form')).toBeTruthy();

    //now verify various accessibility features of the dialog
    await expect(dialog.ariaModal).toEqual('true');
    await waitFor(() =>
      expect(
        within(dialog).getByRole('button', { name: 'Close' }),
      ).toHaveFocus(),
    );

    //The buttons (there is only one) should _wrap_
    //on tab as per the expectation for dialog role
    //Since we only have a single button this should
    //be a _keyboard trap_ i.e. tabbing forward or
    //back doesn't allow you to leave it.
    //1. FIRST, we tab forward
    await userEvent.tab();
    //the Close button should still have focus
    await expect(
      within(dialog).getByRole('button', { name: 'Close' }),
    ).toHaveFocus();

    //2. THEN, we tab backward
    await userEvent.tab({ shift: true });

    //the close button should still have focus
    await expect(
      within(dialog).queryByRole('button', { name: 'Close' }),
    ).toHaveFocus();

    //we should still be able to close the dialog
    //by pressing Enter though there is a separate
    //story for testing a just-opened dialog, without
    //first tabbing back and forth as we ahv done here)
    await userEvent.keyboard('{Enter}');

    //now the dialog should be gone (in a few milliseconds
    //may be as there may be some CSS tansition that slowly
    //makes it disappear!)
    await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeFalsy());

    //focus should be set on the form control on which
    //it was at the time the dialog was shown. This
    //is an accessibility requriement for alertdialog and/or
    //dialog role. Also important for usability.
    await expect(canvas.getByLabelText(productPriceLabel)).toHaveFocus();
    //and, for usability (this is over and above the
    //dialog role requirment that the field be focused
    //when dialog is closed):
    //cursor should be at the end of the field
    //as it was when we pressed enter to submit form,
    //so that if we type one mor lettter, it would get added
    //to the end of the previous value in the field.
    const additionalChar = '5';
    await userEvent.type(
      canvas.getByLabelText(productPriceLabel),
      additionalChar,
    );
    await expect(canvas.getByLabelText(productPriceLabel)).toHaveValue(
      partialPriceValue + additionalChar,
    );
  },
};

export const AlertDialogCanBeClosedToGetBackToForm: Story = {
  args: {
    ...TestCase,
  },
  render: AlertDialogIsAccessible.render,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);

    //submit form to cause error during submission asynchronously
    //(afer a delay)
    canvas.getByRole('button', { name: 'Submit Form' }).click();

    // wait for alertdialog role with exepcted accessible name
    // and accessible description to be shown
    /* const dialog = await canvas.findByRole('alertdialog', {
      name: TestCase.title,
      description: TestCase.description,
    }); */
  },
};
