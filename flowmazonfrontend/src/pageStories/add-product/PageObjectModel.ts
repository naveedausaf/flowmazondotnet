import { fn, within, userEvent, expect } from '@storybook/test';
import { ByRoleOptions } from '@testing-library/dom';

export type TextboxGetter = (
  options?: Omit<ByRoleOptions, 'name'>,
) => HTMLElement;

export type AddProductPagePOM = {
  getAddProductForm: () => {
    tlFormContainer: ReturnType<typeof within>;
    formElement: HTMLElement;
    getName: TextboxGetter;
    getDescription: TextboxGetter;
    getImageUrl: (required: boolean) => Promise<HTMLElement>;
    getPrice: (required: boolean) => Promise<HTMLElement>;
    getSubmitButton: () => Promise<HTMLElement>;
  };
};

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
          return tlFormContainer.getByRole('textbox', {
            name: /^Name/,
            ...options,
          });
        },

        getDescription: (options?: Omit<ByRoleOptions, 'name'>) => {
          return tlFormContainer.getByRole('textbox', {
            name: /^Description/,
            ...options,
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
