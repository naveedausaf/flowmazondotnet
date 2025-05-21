import { WithinHTMLElement } from '@/utils/types';
import { expect, userEvent, waitFor } from '@storybook/test';

export default function createAlertDialogPOM(
  tlCanvas: WithinHTMLElement,
  accessibleName: string,
  accessibleDescription?: string,
) {
  return {
    assert: {
      alertDialogShown: async () => {
        await waitFor(() =>
          expect(
            tlCanvas.queryByRole('alertdialog', {
              name: accessibleName,
              description: accessibleDescription,
            }),
          ).toBeTruthy(),
        );
      },
      alertDialogNotShown: async () => {
        await waitFor(() =>
          expect(
            tlCanvas.queryByRole('alertdialog', {
              name: accessibleName,
              description: accessibleDescription,
            }),
          ).toBeFalsy(),
        );
      },
    },
    act: {
      dismissAlertDialog: async () => {
        //since it is a model dialog and there is
        //only one button, the Close button,
        //it would be enough to press Enter to close it
        await userEvent.keyboard('{Enter}');

        //now the dialog should be gone (in a few milliseconds
        //may be as there may be some CSS tansition that slowly
        //makes it disappear!)
        //the following line both waits for (for the caller's
        //sake) and checks that it has indeed disappeared

        await waitFor(() =>
          expect(tlCanvas.queryByRole('alertdialog')).toBeFalsy(),
        );
      },
    },
  };
}
