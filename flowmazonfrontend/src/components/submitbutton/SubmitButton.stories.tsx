import { Meta, StoryObj } from '@storybook/react';
import SubmitButton from './SubmitButton';
import createSubmitButtonPOM from './SubmitButton.pom';
import { within, userEvent, expect } from '@storybook/test';

import { createFlipFlop } from '@/utils/flipflop';

import FlopInEffectIfFormStatusNoLongerPending, {
  SubmitButtonPropsAndCustomArgs,
} from './FlopInEffectIfFormStatusNoLongerPending';

const meta: Meta<typeof SubmitButton> = {
  component: SubmitButton,
};
export default meta;

type Story = StoryObj<typeof SubmitButton>;

const test1Args: SubmitButtonPropsAndCustomArgs = {
  label: 'Submit',
  submitHandlerEnteredCount: 0,
  flipFlop: createFlipFlop(),
};

function actualRender(test1Args: SubmitButtonPropsAndCustomArgs) {
  console.log(
    `In render function. submitHandlerEnteredCount is ${String(test1Args.submitHandlerEnteredCount)}..also created a new signal`,
  );

  return (
    <>
      <form
        action={async () => {
          test1Args.submitHandlerEnteredCount++;
          console.log(
            `Starting wait on signal. current value of args.submitHandlerEnteredCount is ${String(test1Args.submitHandlerEnteredCount)}`,
          );
          await test1Args.flipFlop.waitForFlip();
          console.log(
            'submit handler resuing after waiting for the signal. about to indicate to the signal object that it has resumed',
          );
          test1Args.flipFlop.resumeAfterFlip();
          console.log(
            'submit handler completed after wait on signal ended. now exiting submit handler',
          );
        }}
      >
        <FlopInEffectIfFormStatusNoLongerPending test1Args={test1Args} />
        <SubmitButton label={test1Args.label} />
      </form>
    </>
  );
}
/**
 * There are lots of [problems with disabled buttons in general](https://axesslab.com/disabled-buttons-suck/) but even when we disable a button for a short period of time while the form is being submitted, I would avoid using `disabled="true"` because it makes the Tab NOT stop on the button so it doesn't get focused while navigating form field with Tab key (which is a very common operation for screen reader users).
 *
 * Instead, I would use `aria-disabled="true"` which is a better solution for screen reader users: they can still stop on the button but it is communicated to them as being disabled.
 *
 * For sighted users, I would use a CSS class to make it look disabled (greyed out), change the cursor to indicate it is not clickable, and write some JavaScript to ensure that clicks are ignored while it is disabled, as [described here](https://www.bekk.christmas/post/2023/24/accessible-loading-button).
 *
 * [This CSS Tricks article](https://css-tricks.com/making-disabled-buttons-more-inclusive/#aa-2-do-not-use-pointer-events-to-prevent-the-click), which covers much the same ground as the previous one, also says with justification that we shouldn't rely on `pointer-events: none` in CSS to prevent a disabled button from being clicked because while it does prevent clicks, it wouldn't prevent the button from being pressed by keyboard, nor submit that occurs when you press Enter on a form field.
 *
 * Addtionally, I would like to set `aria-live` appropriately to announce its status changes but need to also b mindful of a piece of advice in [ARIA alert pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/): that "An alert that disappears too quickly can lead to failure to meet WCAG 2.0 success criterion 2.2.3"
 */
export const LoadingStateShownOnSubmit: Story = {
  // parameters: {
  //   docs: {
  //     source: {
  //       excludeDecorators: false,
  //     },
  //   },
  // },

  // loaders: [
  //   () => ({
  //     label: 'Submit',
  //     submitHandlerEnteredCount: 0,
  //     flipFlop: createFlipFlop(),
  //   }),
  // ],
  render: () => {
    test1Args.submitHandlerEnteredCount = 0;
    test1Args.flipFlop = createFlipFlop();

    return actualRender(test1Args);
  },

  play: async ({ canvasElement }) => {
    console.log(`In play function. test1Args is ${JSON.stringify(test1Args)}`);
    console.log(
      `In play function. SubmitHandlerEnteredCount is ${String(test1Args.submitHandlerEnteredCount)}`,
    );
    //initialise
    const submitButtonPOM = createSubmitButtonPOM(
      within(canvasElement),
      test1Args.label,
    );

    const button = submitButtonPOM.query.getButtonByAccessibleName();

    //preflight checks
    await expect(test1Args.submitHandlerEnteredCount).toBe(0);
    await submitButtonPOM.assert.normalStateShown();

    //cick the button to submit the form
    await userEvent.click(button);

    //check that the button cannot be clicked again
    //(i.e. effectively it is disabled, except that it
    //may not have have been disabled by setting
    //disabled="true" for accessibility reasons)
    await expect(test1Args.submitHandlerEnteredCount).toBe(1);

    //check for loading state being shown
    await submitButtonPOM.assert.loadingStateShown();

    //but in this state it should still be possible to
    //tab to the button and press Enter repeatedly
    //to click it (for setting disabled="true" would be
    //terrible for accessibility)
    await userEvent.tab({ shift: true });

    await expect(
      submitButtonPOM.query.getButtonByAccessibleName(),
    ).not.toHaveFocus();

    await userEvent.tab();
    //check button still has focus
    await expect(
      submitButtonPOM.query.getButtonByAccessibleName(),
    ).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard('{Enter}');

    //but these clicks should not do anything:
    //we will soon check that the submit handler
    //was only called once.

    //TODO: Check for alert for screen reader

    //allow the submit handler to complete
    test1Args.flipFlop.flip();

    //now wait for the submit handler to complete
    await test1Args.flipFlop.waitForFlop();

    console.log(
      'In play function, completed wait for submit handler and subsequent re-render to complete',
    );
    //now make sure the submit handler has completed
    //and only once
    //had the submit handler been called twice, then
    //after the signal was set, this would be 2
    await expect(test1Args.submitHandlerEnteredCount).toBe(1);

    //Now wait for loading state to be disappear
    //disappear and for button to return to normal state

    await submitButtonPOM.assert.normalStateShown();

    //TODO: check for the alert to say submission is complete.

    console.log(`At end of play function.`);
  },
};

/**
 * Just the visual state, isolated as a visual test
 */
export const LoadingState: Story = {
  //leaving it in a disabled state does
  //by making mock submit handler wait on a Promise
  //that is never resolved (a "floating" or "dangling" promise)
  //leads to problems with the other test above.
  //
  //this has nothing to do with use of flip flop
  //and would even happen if I used simple timer
  //to wait in the above test and not use my flipflip
  //class at all.
  //
  //TODO: Hence re-implement this test by extracing
  //out a pure visual component from submit button and
  //setting it in disabled state, WITHOUT using a play
  //function.
};
