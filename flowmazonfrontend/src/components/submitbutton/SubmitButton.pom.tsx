import { ByRoleOptionsForPOM, WithinHTMLElement } from '@/utils/types';

//import { expect, userEvent, waitFor } from '@storybook/test';

export default function createSubmitButtonPOM(
  tlCanvas: WithinHTMLElement,
  label: string,
) {
  return {
    query: {
      getButton: (options?: ByRoleOptionsForPOM) => {
        return tlCanvas.getByRole('button', {
          name: label,
          ...options,
        });
      },
    },
    act: {},
    assert: {
      loadingStateShown: () => {
        //TODO: implement this
      },
      normalStateShown: () => {
        //TODO: implement this
      },
    },
  };
}
