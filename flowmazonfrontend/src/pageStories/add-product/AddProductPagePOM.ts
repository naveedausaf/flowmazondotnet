import { fn, within, userEvent, expect } from '@storybook/test';

const createAddProductPagePOM = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  return {
    getAddProductForm: async () => {
      const tlFormContainer = within(
        await canvas.getByRole('form', { name: 'add product form' }),
      );
      return {
        tlFormContainer: tlFormContainer,
        getName: async () => {
          return await tlFormContainer.getByRole('textbox', { name: /^Name/ });
        },
        getDescription: async () => {
          return await tlFormContainer.getByRole('textbox', {
            name: /^Description/,
          });
        },
        getImageUrl: async () => {
          return await tlFormContainer.getByRole('textbox', {
            name: /^Image URL/,
          });
        },
        getPrice: async () => {
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
