import createAlertDialogPOM from '@/components/alertdialog/AlertDialog.pom';
import { within } from '@storybook/test';

import { serverErrorTitle, serverErrorMessage } from '@/pages/add-product';
import { ByRoleOptionsForPOM } from '@/utils/types';

export type TextboxGet = (options?: ByRoleOptionsForPOM) => HTMLElement;

export type TextboxQuery = (
  options?: ByRoleOptionsForPOM,
) => HTMLElement | null;

export type TextboxQueries = {
  get: TextboxGet;
  query: TextboxQuery;
};

export type AddProductPagePOM = {
  getAddProductForm: () => {
    tlFormContainer: ReturnType<typeof within>;
    formElement: HTMLElement;
    name: TextboxQueries;
    description: TextboxQueries;
    imageUrl: TextboxQueries;
    price: TextboxQueries;
    getSubmitButton: () => Promise<HTMLElement>;
  };
};

const createAddProductPagePOM = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);

  return {
    serverErrorDialog: createAlertDialogPOM(
      canvas,
      serverErrorTitle,
      serverErrorMessage,
    ),
    queryAddProductForm: () =>
      canvas.queryByRole('form', {
        name: accessibleNames.FormName,
      }),
    getAddProductForm: () => {
      const formElement = canvas.getByRole('form', {
        name: accessibleNames.FormName,
      });

      const tlFormContainer = within(formElement);
      const createTextboxQueries = (
        accessibleName: string,
      ): {
        get: TextboxGet;
        query: TextboxQuery;
      } => ({
        get: (options?: ByRoleOptionsForPOM) => {
          return tlFormContainer.getByRole('textbox', {
            name: new RegExp(`^${accessibleName}`),
            ...options,
          });
        },
        query: (options?: ByRoleOptionsForPOM) => {
          return tlFormContainer.queryByRole('textbox', {
            name: new RegExp(`^${accessibleName}`),
            ...options,
          });
        },
      });

      return {
        tlFormContainer,
        formElement,
        name: createTextboxQueries(accessibleNames.Name),
        description: createTextboxQueries(accessibleNames.Description),
        imageUrl: createTextboxQueries(accessibleNames.ImageUrl),
        price: createTextboxQueries(accessibleNames.Price),
        getSubmitButton: () => {
          return tlFormContainer.getByRole('button', {
            name: new RegExp(`^${accessibleNames.SubmitButton}`),
          });
        },
      };
    },
  };
};
export default createAddProductPagePOM;

//TODO: Move these to the AddProductPage screen component
export const accessibleNames = Object.freeze({
  FormName: 'add product form',
  Name: 'Name',
  Description: 'Description',
  ImageUrl: 'Image URL',
  Price: 'Price',
  SubmitButton: 'Add Product',
});
