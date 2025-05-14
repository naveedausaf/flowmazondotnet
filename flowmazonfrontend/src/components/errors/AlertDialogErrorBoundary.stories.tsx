import { Meta, StoryObj } from '@storybook/react';
import AlertDialogErrorBoundary from './AlertDialogErrorBoundary';
import { TestCase } from './testdata';
import { within, expect, userEvent } from '@storybook/test';

//import { useFormStatus } from 'react-dom';

const meta: Meta<typeof AlertDialogErrorBoundary> = {
  component: AlertDialogErrorBoundary,
};
export default meta;

type Story = StoryObj<typeof AlertDialogErrorBoundary>;
export const Primary: Story = {
  args: {},
};

const msWait = 5;

export const AlertDialogIsAccessible: Story = {
  args: {
    //I could have spread TestCase directly in the
    //component-under-tests being instantiated in render function below.
    //But docs say using args is better e.g. because
    //it allows you to change arg values using Controls addon
    ...TestCase,
  },
  render: (args) => {
    return (
      <AlertDialogErrorBoundary {...args}>
        <form
          aria-label='test form'
          action={async () => {
            return new Promise((resolve, reject) => {
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
              setTimeout(() => {
                console.log(
                  `After waiting for ${String(msWait)}ms to simulate form submission, now throwing error to simulate server error`,
                );
                reject(new Error('Server error'));
              }, msWait);
            });
          }}
        >
          <label htmlFor='productName'>Product Name:</label>
          <input type='text' id='productName' name='productName' />
          <button type='submit'>Submit Form</button>
        </form>
      </AlertDialogErrorBoundary>
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    //now, the form should be shown but alert dialog should not exist
    await expect(canvas.getByRole('form')).toBeTruthy();
    await expect(canvas.queryByRole('alertdialog')).toBeFalsy();

    //submit form to cause error during submission asynchronously
    //(afer a delay)
    canvas.getByRole('button', { name: 'Submit Form' }).click();

    // wait for alertdialog role with exepcted accessibility attributes to come up
    const dialog = await canvas.findByRole('alertdialog', {
      name: TestCase.title,
      description: TestCase.description,
    });

    //at this point the form should no longer exist
    await expect(canvas.queryByRole('form')).toBeFalsy();

    //now verify various accessibility features of the dialog
    await expect(dialog.ariaModal).toEqual('true');
    await expect(
      within(dialog).getByRole('button', { name: 'Close' }),
    ).toHaveFocus();

    //The buttons (there is only one) should _wrap_
    //on tab as per the expectation for dialog role
    //Since we only have a single button this should
    //be a _keyboard trap_ i.e. tabbing forward or
    //back doesn't allow you to leave it.
    //1. FIRST, we tab forward
    await userEvent.tab();
    await expect(
      within(dialog).getByRole('button', { name: 'Close' }),
    ).toHaveFocus();
    //2. THEN, we tab backward
    await userEvent.tab({ shift: true });
    await expect(
      within(dialog).getByRole('button', { name: 'Close' }),
    ).toHaveFocus();

    //we should still be able to close the dialog
    //by pressing Enter though there is a separate
    //story for testing a just-opened dialog, without
    //first tabbing back and forth as we ahv done here)
    await userEvent.keyboard('{Enter}');

    //now the dialog should be gone
    await expect(canvas.queryByRole('alertdialog')).toBeFalsy();

    //the form should be visible again
    await expect(canvas.getByRole('form')).toBeTruthy();

    //focus should be set on the form control on which
    //it was at the time the dialog was shown
    //TODO: complete testing for this condition
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
