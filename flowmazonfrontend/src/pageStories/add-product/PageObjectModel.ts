import { fn, within, userEvent, expect } from '@storybook/test';
import { ByRoleOptions } from '@testing-library/dom';

const createAddProductPagePOM = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const formElement = canvas.getByRole('form', { name: 'add product form' });
  return {
    getAddProductForm: () => {
      const tlFormContainer = within(formElement);
      return {
        tlFormContainer: tlFormContainer,
        formElement,
        getName: (options?: Omit<ByRoleOptions, 'name'>) => {
          let y: keyof Parameters<typeof tlFormContainer.getByRole>;
          y = 1;

          return tlFormContainer.getByRole('textbox', {
            name: /^Name/,
            ...options,
          });
        },
        queryName_withAccessibleDescription: (accessibleDescription: string) =>
          tlFormContainer.queryByRole('textbox', {
            name: /^Name/,
            description: accessibleDescription,
          }),
        // getNameErrorByText: async (errorMessage) => {
        //   return await tlFormContainer.getByText(
        //     errorMessage,
        //     {

        //     }
        //   )
        // }
        getDescription: async (requried: boolean) => {
          return await tlFormContainer.getByRole('textbox', {
            name: /^Description/,
          });
        },
        getImageUrl: async (required: boolean) => {
          return await tlFormContainer.getByRole('textbox', {
            name: /^Image URL/,
          });
        },
        getPrice: async (required: boolean) => {
          return await tlFormContainer.getByRole('textbox', { name: /^Price/ });
        },
        getSubmitButton: async () => {
          return await tlFormContainer.getByRole('button', {
            name: /^Add Product/,
          });
        },
      };
    },
  };
};
export default createAddProductPagePOM;
