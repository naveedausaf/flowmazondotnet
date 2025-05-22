import { Meta, StoryObj } from '@storybook/react';
import SubmitButton from './SubmitButton';
import createSubmitButtonPOM from './SubmitButton.pom';
import { within, userEvent, expect, waitFor } from '@storybook/test';

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

const test2Args: SubmitButtonPropsAndCustomArgs = {
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
          await new Promise((resolve) => {
            console.log(
              `In submit handler. submitHandlerEnteredCount is ${String(
                test1Args.submitHandlerEnteredCount,
              )}`,
            );
            setTimeout(() => {
              console.log('in submit handler, flipping the flipFlop');
              test1Args.flipFlop.flip();
              resolve(true);
            }, 1000);
          });
        }}
      >
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
    //TODO: click the button three times by tabbing to
    // //it and pressing Enter
    //
    // TODO: Check that the button did get clicked
    //three times.

    //but these clicks should not do anything:
    //we will soon check that the submit handler
    //was only called once.

    //TODO: Check for alert for screen reader

    //allow the submit handler to complete
    test1Args.flipFlop.flip();

    //now wait for the submit handler to complete
    //await test1Args.flipFlop.waitForFlop();

    console.log(
      'In play function, completed wait for submit handler and subsequent re-render to complete',
    );

    //Now wait for loading state to be disappear
    //disappear and for button to return to normal state

    await waitFor(() => submitButtonPOM.assert.normalStateShown());

    //now make sure the submit handler has completed
    //and only once
    //had the submit handler been called twice, then
    //after the signal was set, this would be 2
    await expect(test1Args.submitHandlerEnteredCount).toBe(1);

    //TODO: check for the alert to say submission is complete.

    console.log(`At end of play function.`);
  },
};

/**
 * Just the visual state, isolated as a visual test
 */
export const LoadingState: Story = {
  // parameters: {
  //   docs: {
  //     source: {
  //       excludeDecorators: false,
  //     },
  //   },
  // },
  //args: LoadingStateShownOnSubmit.args,
  render: () => {
    return (
      <>
        <form
          action={async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            await new Promise((resolve) => {});
          }}
        >
          <SubmitButton label={test1Args.label} />
        </form>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const submitButtonPOM = createSubmitButtonPOM(
      within(canvasElement),
      test2Args.label,
    );
    const button = submitButtonPOM.query.getButtonByAccessibleName();
    await userEvent.click(button);
  },
};
