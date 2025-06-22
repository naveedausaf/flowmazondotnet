/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Meta, StoryObj } from '@storybook/nextjs';
import { fn, waitFor } from 'storybook/test';
import { TestCase } from './testdata';
import { within, expect, userEvent } from 'storybook/test';
import AlertDialog from './AlertDialog';
import { useEffect, useId, useState } from 'react';

/**
 * `AlertDialog` is accessible and following sources were used in its tests and implementation to ensure that that `AlertDialog` is acceessible (these also contributed to usability):
 *
 * 1. [ARIA alertdialog role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alertdialog_role)
 *
 * 2. [ARIA alert role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/alert_role)
 *
 * 3. [ARIA dialog role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/dialog_role)
 *
 * 4. [`<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
 *
 * 5. [ARIA APG Alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
 *
 * 6. [ARIA APG Alert and Message Dialogs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/)
 *
 * 7. [ARIA APG Dialog (Modal) Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
 * */
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

const nonExistentElementId = 'non-existent-element-id';
export const ElementIdToFocusAfterDialogClosed_NotValid: Story = {
  args: {
    ...TestCase,
  },
  render: (args) => {
    // Provide a non-existent elementIdToFocusAfterDialogClosed
    const [open, setOpen] = useState<boolean>(false);
    return (
      <>
        <AlertDialog
          {...args}
          open={open}
          elementIdToFocusAfterDialogClosed={nonExistentElementId}
          onClose={() => {
            setOpen(false);
          }}
        />
        <button
          onClick={() => {
            setOpen(true);
          }}
        >
          Open Dialog
        </button>
      </>
    );
  },
  parameters: {
    // Disable the default actions for the error event
    test: {
      //ensures that the error doesn't blow up the test
      //e.stopPropagation and e.stopImmediatePropagation
      //do not work. Setting the parameter below
      //is what needs to be done
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvasElement }) => {
    let errorCaught: ErrorEvent | undefined = undefined;

    window.addEventListener('error', (e) => {
      //Check the error
      if (e.message && e.message.includes(nonExistentElementId)) {
        //we have caught the error we were looking for
        errorCaught = e;

        //stop the error from being reported in console
        //as uncaught error
        e.preventDefault();
      }
    });
    const canvas = within(canvasElement);

    // Open the dialog
    await userEvent.click(canvas.getByRole('button', { name: 'Open Dialog' }));

    // Wait for the dialog to appear
    const dialog = await canvas.findByRole('alertdialog', {
      name: TestCase.title,
      description: TestCase.description,
    });

    // Try to close the dialog and expect an error to be thrown

    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Close' }),
    );

    //wait for dialog to have disappeared from accessibility tree
    await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeFalsy());

    //Wait for an error to appear on window.error event.
    //It should have been throw on close
    //and caught in the event handler above
    await waitFor(() => expect(errorCaught).toBeTruthy());
  },
};

export const AlertDialogCanBeClosedToGetBackToForm: Story = {
  args: {
    ...TestCase,
  },
  render: AlertDialogIsAccessible.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    //submit form to cause error during submission asynchronously
    //(afer a delay)
    canvas.getByRole('button', { name: 'Submit Form' }).click();

    // wait for alertdialog role with exepcted accessibility attributes to come up
    const dialog = await canvas.findByRole('alertdialog', {
      name: TestCase.title,
      description: TestCase.description,
    });

    // Ensure the dialog is open
    await expect(dialog).toBeTruthy();

    // Press the Close button
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Close' }),
    );

    // Ensure the dialog is no longer open
    await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeFalsy());

    //but the form is still visible
    await expect(canvas.getByRole('form')).toBeTruthy();
  },
};

export const EscapeClosesAlertDialog: Story = {
  args: {
    ...TestCase,
  },
  render: AlertDialogIsAccessible.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the dialog
    await userEvent.click(canvas.getByRole('button', { name: 'Submit Form' }));

    // Wait for the dialog to appear
    const dialog = await canvas.findByRole('alertdialog', {
      name: TestCase.title,
      description: TestCase.description,
    });

    // Press the Escape key to close the dialog
    await userEvent.keyboard('{Escape}');

    // Wait for the dialog to disappear
    await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeFalsy());
  },
};
