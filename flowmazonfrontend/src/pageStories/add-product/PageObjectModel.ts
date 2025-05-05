import { fn, within, userEvent, expect } from '@storybook/test';
import { ByRoleOptions } from '@testing-library/dom';

export type TextboxGetter = (
  options?: Omit<ByRoleOptions, 'name'>,
) => HTMLElement;

export type TextboxQuerier = (
  options?: Omit<ByRoleOptions, 'name'>,
) => HTMLElement | null;

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

const createTextboxQueries = (
  tlFormContainer: ReturnType<typeof within>,
  accessibleName: string,
): {
  get: TextboxGetter;
  query: TextboxQuerier;
} => ({
  get: (options?: Omit<ByRoleOptions, 'name'>) => {
    return tlFormContainer.getByRole('textbox', {
      name: new RegExp(`^${accessibleName}`),
      ...options,
    });
  },
  query: (options?: Omit<ByRoleOptions, 'name'>) => {
    return tlFormContainer.queryByRole('textbox', {
      name: new RegExp(`^${accessibleName}`),
      ...options,
    });
  },
});

const createAddProductPagePOM = (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  const formElement = canvas.getByRole('form', {
    name: accessibleNames.FormName,
  });

  const tlFormContainer = within(formElement);

  return {
    getAddProductForm: () => {
      return {
        tlFormContainer,
        formElement,
        name: createTextboxQueries(tlFormContainer, accessibleNames.Name),
        description: createTextboxQueries(
          tlFormContainer,
          accessibleNames.Description,
        ),
        imageUrl: createTextboxQueries(
          tlFormContainer,
          accessibleNames.ImageUrl,
        ),
        price: createTextboxQueries(tlFormContainer, accessibleNames.Price),
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
