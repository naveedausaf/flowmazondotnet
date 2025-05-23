import { Meta, StoryObj } from '@storybook/react';
import TestStrictModeInStorybook from './TestStrictModeInStorybook';
import { StrictMode } from 'react';

/**
 * UNCOMMENT THE STORIES IN THIS FILE TO SEE THE BEHAVIOUR TESTED FOR!
 *
 * I had to comment them out so they do not get tested by axe-storybook a11y tester. I could not exclude them because I am having to run the tester against storybook served by storybook dev server rather than directly again (the pacakge of) the app as that was causing compile issues/race conditions with the continuous storybook testing I have runnin in a separate terminal window.
 *
 * The two stories show that in storybook, components under test are NOT rendered under StrictMode.
 *
 * Open up the F12 developer toolbar and go to its Console section. Then view the two stories for this (`TestStrictModeInStorybook`) component. As you view each story, first clear the log (type `console.clear()` in console) once the story is shown (it would have rendered once already). Then clic the buton to increment the count that would trigger the effect which would show it in the textbox. **Observe the following:**
 *
 * * In story WITHOUTStrictMode the console output shows that the render function (i.e. the component's function) is called only once. Also, the effect executes only once.
 *
 * * In story WithStrictMode, in which `render` wraps `<TestStrictModeInStorybook />` component in `<StrictMode>`, the console output shows that the render function is called twice BUT the effect executes only once.
 *
 * **Explanation for this behaviour is that:**
 *
 * * Storybook does not wrap the components in `<StrictMode>`. Otherwise we would see the render function called twice in `WITHOUTStrictMode` story also.
 *
 * * [As per the documentation](https://react.dev/reference/react/StrictMode#enabling-strict-mode-for-entire-app) (see "Note" sidebar), if `<StrictMode>` is enabled for only part of a page, then the render function of wrapped component is still called twice BUT any effects execute ONLY ONCE. Otherwise effects too would execute twice like the render function.
 */

// eslint-disable-next-line storybook/story-exports
const meta: Meta<typeof TestStrictModeInStorybook> = {
  title: 'Components/TestStrictModeInStorybook',
  component: TestStrictModeInStorybook,
  parameters: {
    a11y: { disable: true }, // Disable a11y checks for this
    //component's stories as it is only a test component
    //for exploring StrictMode in Storybook
  },
  globals: {
    a11y: {
      manual: true,
    },
  },
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Story = StoryObj<typeof TestStrictModeInStorybook>;

/*
export const WithStrictMode: Story = {
  render: () => (
    <StrictMode>
      <TestStrictModeInStorybook />
    </StrictMode>
  ),
};

export const WITHOUTStrictMode: Story = {
  render: () => (
    <StrictMode>
      <TestStrictModeInStorybook />
    </StrictMode>
  ),
};

*/
