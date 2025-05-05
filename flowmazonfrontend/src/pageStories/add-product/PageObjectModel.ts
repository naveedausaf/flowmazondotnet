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
  const formElement = canvas.getByRole('form', {
    name: accessibleNames.FormName,
  });
  return {
    getAddProductForm: () => {
      const tlFormContainer = within(formElement);
      return {
        tlFormContainer: tlFormContainer,
        formElement,
        getName: (options?: Omit<ByRoleOptions, 'name'>) => {
          return tlFormContainer.getByRole('textbox', {
            name: new RegExp(`^${accessibleNames.Name}`),
            ...options,
          });
        },
        queryName: (options?: Omit<ByRoleOptions, 'name'>) => {
          return tlFormContainer.queryByRole('textbox', {
            name: new RegExp(`^${accessibleNames.Name}`),
            ...options,
          });
        },
        getDescription: (options?: Omit<ByRoleOptions, 'name'>) => {
          return tlFormContainer.getByRole('textbox', {
            name: new RegExp(`^${accessibleNames.Description}`),
            ...options,
          });
        },
        getImageUrl: (options?: Omit<ByRoleOptions, 'name'>) => {
          return tlFormContainer.getByRole('textbox', {
            name: new RegExp(`^${accessibleNames.ImageUrl}`),
            ...options,
          });
        },
        getPrice: (options?: Omit<ByRoleOptions, 'name'>) => {
          return tlFormContainer.getByRole('textbox', {
            name: new RegExp(`^${accessibleNames.Price}`),
            ...options,
          });
        },
        getSubmitButton: async () => {
          return await tlFormContainer.getByRole('button', {
            name: new RegExp(`^${accessibleNames.SubmitButton}`),
          });
        },
      };
    },
  };
};
export default createAddProductPagePOM;

export const accessibleNames = Object.freeze({
  FormName: 'add product form',
  Name: 'Name',
  Description: 'Description',
  ImageUrl: 'Image URL',
  Price: 'Price',
  SubmitButton: 'Add Product',
});
