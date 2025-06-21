import { ByRoleOptionsForPOM, WithinHTMLElement } from '@/utils/types';

import { expect, screen } from 'storybook/test';
//import exp from 'constants';

export default function createSubmitButtonPOM(
  tlCanvas: WithinHTMLElement,
  label: string,
) {
  const query = {
    getButtonByAccessibleName: (options?: ByRoleOptionsForPOM) => {
      return tlCanvas.getByRole('button', {
        name: label,
        ...options,
      });
    },
  };

  const containsChildWithLoadingClass = (element: HTMLElement): boolean => {
    let childWithLoadingClassFound: boolean = false;

    for (const child of element.children) {
      if (child.classList.contains('loading')) {
        childWithLoadingClassFound = true;
        break;
      }
    }
    return childWithLoadingClassFound;
  };
  /**
   * the only realistic way of checking if the loading
    state is shown is to check that the button has
    `loading` class or contains an element with `loading` CSS class and that it has the appearance
    of being disabled as well as aria-disabled="true"
   */
  const assert = {
    loadingStateShown: async () => {
      const button = query.getButtonByAccessibleName();

      screen.debug(button);
      await expect(button).toHaveAttribute('aria-disabled', 'true');

      //BRITTLE, TIED TO DAISYUI!!!
      //check to see if it _appears_ disabled
      await expect(button.classList).toContain('btn-disabled');

      //BRITTLE, TIED TO DAISYUI!!!
      //check to see if it _shows_ loading indicator

      await expect(containsChildWithLoadingClass(button)).toBe(true);
    },

    normalStateShown: async () => {
      const button = query.getButtonByAccessibleName();
      await expect(button).toHaveAttribute('aria-disabled', 'false');

      //BRITTLE, TIED TO DAISYUI!!!
      //check to see if it _shows_ loading indicator
      await expect(containsChildWithLoadingClass(button)).toBe(false);

      //BRITTLE, TIED TO DAISYUI!!!
      //check to see if it _appears_ disabled
      await expect(button.classList).not.toContain('btn-disabled');
    },
  };
  return {
    query,
    act: {},
    assert,
  };
}
