import { Meta, StoryObj } from '@storybook/react';
import SubmitButton from './SubmitButton';
import createSubmitButtonPOM from './SubmitButton.pom';
import { within, userEvent, expect, waitFor } from '@storybook/test';
import createSameAgentSignal, { Signal } from '../../utils/signal';

type SubmitButtonPropsAndCustomArgs = React.ComponentProps<
  typeof SubmitButton
> & {
  submitHandlerEnteredCount: number;
  submitHandlerSignal: Signal;
};

const meta: Meta<SubmitButtonPropsAndCustomArgs> = {
  component: SubmitButton,
};
export default meta;

type Story = StoryObj<SubmitButtonPropsAndCustomArgs>;

/**
 * There are lots of [problems with disabled buttons in general](https://axesslab.com/disabled-buttons-suck/) but even when we disable it for a short period of time whiel the form is being submitted, I would avoid using `disabled="true"` because it makes the Tab NOT stop on the button so it doesn't get focused while navigating form field with Tab key (which is a very common operation for screen reader users).
 *
 * Instead, I would use `aria-disabled="true"` which is a better solution for screen reader users: they can still stop on the button but it is communicated to them as being disabled. For sighted users, I would use a CSS class to make it look disabled (greyed out), change teh cursor to indicate it is not clickable, and write some JavaScript to ensure that clicks are ignored while it is disabled, as [described here](https://www.bekk.christmas/post/2023/24/accessible-loading-button).
 *
 * [This CSS Tricks article](https://css-tricks.com/making-disabled-buttons-more-inclusive/#aa-2-do-not-use-pointer-events-to-prevent-the-click), which covers much the same ground as the previous one, also says with justification taht we shouldn't use `pointer-events: none` in CSS to prevent a disabled button from being clicked because while it does prevent clicks, it wouldn't precent the button from being pressed, it would prevent the button being pressed by keyboard, nor submit that occurs when you press Enter on a form field.
 *
 * Addtionally, I would like to set `aria-live` appropriately to announce its status changes but need to also b mindful of a piece of advice in [ARIA alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/): that "An alert that disappears too quickly can lead to failure to meet WCAG 2.0 success criterion 2.2.3"
 */
export const LoadingStateOnSubmit: Story = {
  args: {
    label: 'Submit',
  },

  render: (args) => {
    //reset args as they will not be reset
    //when the story is re-rendered and play function
    //re-run which is annoying during development
    args.submitHandlerEnteredCount = 0;
    args.submitHandlerSignal = createSameAgentSignal();

    console.log(
      `In render function. submitHandlerEnteredCount is ${args.submitHandlerEnteredCount}..also created a new signal`,
    );
    return (
      <>
        <form
          action={async () => {
            args.submitHandlerEnteredCount++;
            console.log(
              `Starting wait on signal. current value of args.submitHandlerEnteredCount is ${args.submitHandlerEnteredCount}`,
            );
            await args.submitHandlerSignal.waitForSignal();
            console.log(
              'submit handler resuing after waiting for the signal. about to indicate to the signal object that it has resumed',
            );
            args.submitHandlerSignal.resumeAfterWaitingForSignal();
            console.log(
              'submit handler completed after wait on signal ended. now exiting submit handler',
            );
          }}
        >
          <SubmitButton label={args.label} />
        </form>
      </>
    );
  },

  play: async ({ canvasElement, args }) => {
    console.log(
      `In play function. SubmitHandlerEnteredCount is ${args.submitHandlerEnteredCount}`,
    );
    //initialise
    const submitButtonPOM = createSubmitButtonPOM(
      within(canvasElement),
      args.label,
    );

    const button = submitButtonPOM.query.getButton();

    //preflight checks
    await expect(args.submitHandlerEnteredCount).toBe(0);
    submitButtonPOM.assert.normalStateShown();

    //cick the button to submit the form
    await userEvent.click(button);

    //check that the button cannot be clicked again
    //(i.e. effectively it is disabled, except that it
    //may not have have been disabled by setting
    //disabled="true" for accessibility reasons)
    await expect(args.submitHandlerEnteredCount).toBe(1);

    //To check that several successive clicks
    //do NOT invoke the submit handler (i.e. the
    //button is effectively disabled right now),
    //we press submit button multiple times
    //We will check LATER that the
    //count of submit handler invocation is still one
    await userEvent.click(button);
    await userEvent.click(button);

    //check for loading state being shown
    submitButtonPOM.assert.loadingStateShown();

    //TODO: Check for alert for screen reader

    //allow the submit handler to complete
    args.submitHandlerSignal.set();

    //now wait for the submit handler to complete
    await args.submitHandlerSignal.waitThatSignalledCodeHasResumed();

    console.log(
      'In play function, completed wait for submit handler to complete',
    );
    //now make sure the submit handler has completed
    //and only once
    //had the submit handler been called twice, then
    //after the signal was set, this would be 2
    await expect(args.submitHandlerEnteredCount).toBe(1);

    //Now wait for loading state to be disappear
    //disappear and for button to return to normal state
    submitButtonPOM.assert.normalStateShown();

    //TODO: check for the alert to say submission is complete.

    console.log(`At end of play function.`);
  },
};
